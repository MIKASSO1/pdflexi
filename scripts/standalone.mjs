import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import { build } from "esbuild";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
const result = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  write: false,
  outfile: "preview.js",
  minify: true,
  format: "iife",
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.BASE_URL": '"./"',
    "import.meta.env.PDFLEXI_STANDALONE": "true",
  },
  plugins: [
    {
      name: "inline-pdf-worker",
      setup(plugin) {
        plugin.onResolve({ filter: /\?url$/ }, (args) => ({
          path: require.resolve(args.path.replace(/\?url$/, "")),
          namespace: "data-url",
        }));
        plugin.onLoad(
          { filter: /.*/, namespace: "data-url" },
          async (args) => ({
            contents: `export default ${JSON.stringify("data:text/javascript;base64," + (await readFile(args.path)).toString("base64"))}`,
            loader: "js",
          }),
        );
      },
    },
  ],
  loader: { ".tsx": "tsx", ".woff2": "dataurl" },
});
const js = result.outputFiles
  .find((f) => f.path.endsWith(".js"))
  .text.replace(/<\/script/gi, "<\\/script");
const css = result.outputFiles.find((f) => f.path.endsWith(".css")).text;
const assets = {};
for (const folder of ["cmaps", "standard_fonts", "wasm"]) {
  for (const name of await readdir(`node_modules/pdfjs-dist/${folder}`)) {
    if (!/\.(bcmap|ttf|pfb|wasm|js)$/.test(name)) continue;
    assets[`${folder}/${name}`] = (
      await readFile(`node_modules/pdfjs-dist/${folder}/${name}`)
    ).toString("base64");
  }
}
const offlineLoader = `(()=>{const assets=${JSON.stringify(assets)};const original=window.fetch.bind(window);window.fetch=(input,init)=>{const raw=input instanceof Request?input.url:String(input);const key=raw.split('/pdfjs/')[1];if(key&&assets[key]){const bytes=Uint8Array.from(atob(assets[key]),c=>c.charCodeAt(0));return Promise.resolve(new Response(bytes,{headers:{'Content-Type':key.endsWith('.wasm')?'application/wasm':key.endsWith('.js')?'text/javascript':'application/octet-stream'}}));}return original(input,init);};})();`;
const favicon = await readFile("public/favicon.svg", "utf8");
const html = `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f4f2ee"><title>PDFlexi — Upload. Ask. Live Canvas.</title><link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}"><style>${css}</style></head><body><div id="root"></div><script>${offlineLoader}${js}</script></body></html>`;
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/pdflexi-preview.html", html);
console.log("Standalone preview created.");
