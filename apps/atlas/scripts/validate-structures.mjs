import fs from 'node:fs';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const atlas = JSON.parse(fs.readFileSync(new URL('public/models/atlas.json', root)));
const ref = JSON.parse(fs.readFileSync(new URL('public/content/structures.json', root)));
const conceptIds = new Set(atlas.concepts.map((c) => c.id));

let defs = 0, images = 0, links = 0;
for (const [id, entry] of Object.entries(ref)) {
  assert.ok(conceptIds.has(id), `${id}: not an atlas concept`);
  assert.ok(
    entry.definition || entry.description || entry.synonyms || entry.partOf || entry.isA || entry.wiki || entry.image,
    `${id}: stub entry`,
  );
  if (entry.definition || entry.description) defs++;
  if (entry.image) {
    images++;
    assert.match(entry.image.src, /^https:\/\/(upload|thumb)\.wikimedia\.org\//, `${id}: unusual image host`);
    assert.doesNotMatch(entry.image.src, /\.gif$/i, `${id}: animated gif`);
    assert.ok(entry.image.artist && entry.image.license && entry.image.page, `${id}: missing attribution`);
  }
  if (entry.wiki) links++;
  for (const field of ['synonyms', 'partOf', 'isA']) {
    const list = entry[field] ?? [];
    assert.equal(new Set(list).size, list.length, `${id}: duplicate ${field}`);
  }
}
const frontal = ref.FMA52734;
assert.ok(frontal?.definition && frontal?.wiki, 'frontal bone should be enriched');
console.log(`Verified ${Object.keys(ref).length} reference entries: ${defs} definitions, ${images} attributed images, ${links} article links.`);
