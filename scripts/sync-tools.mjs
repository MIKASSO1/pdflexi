/** Discover independent tool modules. Run after adding/removing a module directory. */
import { readdir, access, writeFile } from "node:fs/promises";
const root = new URL("../packages/tools/src/", import.meta.url);
const entries = (
  await readdir(new URL("modules/", root), { withFileTypes: true })
)
  .filter((item) => item.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));
const definitions = [],
  names = [],
  loaders = [],
  translations = [];
for (const [index, entry] of entries.entries()) {
  if (!/^[a-z0-9-]+$/.test(entry.name))
    throw new Error("Invalid tool directory name.");
  await access(new URL(`modules/${entry.name}/index.ts`, root));
  definitions.push(
    `import { definition as t${index} } from "./modules/${entry.name}/index.ts";`,
  );
  names.push(`t${index}`);
  try {
    await access(new URL(`modules/${entry.name}/logic.ts`, root));
    loaders.push(
      `  "${entry.name}": () => import("./modules/${entry.name}/logic.ts"),`,
    );
  } catch {
    /* Planned tools deliberately have no executor. */
  }
  const files = await readdir(new URL(`modules/${entry.name}/i18n/`, root));
  for (const file of files.filter((file) => /^[a-z]{2}\.json$/.test(file)))
    translations.push(
      `  "${entry.name}/${file.slice(0, 2)}": () => import("./modules/${entry.name}/i18n/${file}", { with: { type: "json" } }).then(module => module.default),`,
    );
}
await writeFile(
  new URL("index.ts", root),
  `${definitions.join("\n")}\nexport const toolDefinitions = [${names.join(", ")}] as const;\n`,
);
await writeFile(
  new URL("loaders.ts", root),
  `import type { Artifact, InputDocument, Parameters } from "../../core/src/index.ts";\ntype Module = { execute: (inputs: InputDocument[], parameters: Parameters) => Promise<Artifact[]> };\nexport const loaders: Record<string, (() => Promise<Module>) | undefined> = {\n${loaders.join("\n")}\n};\n`,
);
await writeFile(
  new URL("translations.ts", root),
  `export type ToolTranslation = { name: string; description: string; prompt: string };\nconst loaders: Record<string, (() => Promise<ToolTranslation>) | undefined> = {\n${translations.join("\n")}\n};\nexport async function loadToolTranslation(id: string, locale: string) {\n  const key = id + "/" + locale, fallback = id + "/en";\n  const loader = loaders[key] || loaders[fallback];\n  if (!loader) throw new Error("Unknown tool translation.");\n  return { copy: await loader(), locale: loaders[key] ? locale : "en", fallback: !loaders[key] };\n}\n`,
);
console.log(
  `Discovered ${entries.length} tools, ${loaders.length} local executors and ${translations.length} translation files.`,
);
