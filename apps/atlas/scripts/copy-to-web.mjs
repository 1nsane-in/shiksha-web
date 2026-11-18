import { cp, rm, readFile, writeFile } from "node:fs/promises";

const dist = new URL("../dist/", import.meta.url);
const out = new URL("../../web/public/atlas-viewer/", import.meta.url);

await rm(out, { recursive: true, force: true });
await cp(dist, out, { recursive: true });

const manifestUrl = new URL("models/atlas.json", out);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
for (const chunk of manifest.chunks) {
  chunk.url = chunk.url.replace(/^\/models\//, "models/");
  if (chunk.gzip) chunk.gzip = chunk.gzip.replace(/^\/models\//, "models/");
}
await writeFile(manifestUrl, JSON.stringify(manifest));
console.log("Atlas copied to apps/web/public/atlas-viewer");
