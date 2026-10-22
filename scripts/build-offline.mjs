import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Script } from "node:vm";
const index = await readFile("dist/index.html", "utf8");
const shell = [
  "./",
  "./index.html",
  "./favicon.svg",
  "./manifest.webmanifest",
  ...[...index.matchAll(/(?:src|href)="(\.\/assets\/[^"\s]+)"/g)].map(
    (m) => m[1],
  ),
];
const version = createHash("sha256").update(index).digest("hex").slice(0, 16);
const worker = `
const CACHE = "pdflexi-shell-${version}";
const SHELL = ${JSON.stringify(shell)};
const ROOT = new URL("./", self.location.href);
const MAX_BYTES = 20 * 1024 * 1024;
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("pdflexi-shell-") && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
async function save(cache, request, response) {
  if (!response.ok || response.type === "opaque") return;
  const bytes = Number(response.headers.get("content-length"));
  if (bytes > MAX_BYTES) return;
  const body = await response.clone().arrayBuffer();
  if (body.byteLength > MAX_BYTES) return;
  const keys = await cache.keys();
  // Bounded runtime cache. Never evict the app shell.
  if (keys.length >= 180) {
    const permanent = new Set(SHELL.map(path => new URL(path, ROOT).href));
    const victim = keys.find(key => !permanent.has(key.url));
    if (victim) await cache.delete(victim);
  }
  await cache.put(request, response);
}
self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  const path = url.pathname.slice(ROOT.pathname.length);
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => (await caches.open(CACHE)).match(new URL("./index.html", ROOT))));
    return;
  }
  // Only application-owned static resources. No Blob/file URLs, document data, API traffic, ads or models.
  if (!path.startsWith("assets/") && !path.startsWith("pdfjs/") && !["favicon.svg", "manifest.webmanifest"].includes(path)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE), cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    event.waitUntil(save(cache, request, response.clone()).catch(() => {}));
    return response;
  })());
});
`;
new Script(worker); // Fail the build if generated worker JavaScript is invalid.
await writeFile("dist/sw.js", worker);
console.log(
  `Offline shell generated (${shell.length} resources). Tools work offline only after their chunks are cached.`,
);
