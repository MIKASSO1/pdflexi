import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const result = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  write: false,
  outfile: "preview.js",
  minify: true,
  format: "iife",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".tsx": "tsx", ".woff2": "dataurl" },
});
const js = result.outputFiles
  .find((f) => f.path.endsWith(".js"))
  .text.replace(/<\/script/gi, "<\\/script");
const css = result.outputFiles.find((f) => f.path.endsWith(".css")).text;
const favicon = await readFile("public/favicon.svg", "utf8");
const html = `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f4f2ee"><title>PDFlexi — Upload. Ask. Live Canvas.</title><link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}"><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/pdflexi-preview.html", html);
console.log("Standalone preview created.");
