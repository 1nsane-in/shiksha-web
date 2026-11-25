/**
 * Generates public/content/structures.json — per-structure reference data for
 * the atlas detail panel, merged from open sources:
 *
 *   - Uberon (CC BY 3.0): definitions, synonyms, part-of relations
 *   - Wikidata (CC0): English label/description, Wikipedia article, image
 *   - Wikimedia Commons: image author + license for attribution
 *
 * Run: node scripts/enrich-structures.mjs
 * Requires network. Output is committed so the app never calls these APIs.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const UBERON_URL = "https://purl.obolibrary.org/obo/uberon.obo";
const SPARQL = "https://query.wikidata.org/sparql";
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const UA = "shiksha-atlas-enrich/1.0 (educational anatomy reference)";

const uberonCache = path.join("/tmp/opencode", "uberon.obo");

async function loadUberon() {
  try {
    return await readFile(uberonCache, "utf8");
  } catch {
    const res = await fetch(UBERON_URL, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`Uberon download failed: ${res.status}`);
    const text = await res.text();
    await writeFile(uberonCache, text);
    return text;
  }
}

function parseUberon(obo) {
  const terms = new Map();
  const fmaToTerm = new Map();
  let cur = null;
  const flush = () => {
    if (cur?.id) {
      terms.set(cur.id, cur);
      for (const fma of cur.fma) fmaToTerm.set(fma, cur);
    }
    cur = null;
  };
  for (const line of obo.split("\n")) {
    if (line === "[Term]") {
      flush();
      cur = { id: "", name: "", def: "", synonyms: [], partOf: [], isA: [], fma: [], xrefs: [] };
      continue;
    }
    if (!cur) continue;
    if (line.startsWith("id: ")) cur.id = line.slice(4).trim();
    else if (line.startsWith("name: ")) cur.name = line.slice(6).trim();
    else if (line.startsWith("def: ")) {
      const m = line.match(/def: "([^"]*)"/);
      if (m) cur.def = m[1].replace(/\s+/g, " ").trim();
    } else if (line.startsWith('synonym: "')) {
      const m = line.match(/synonym: "([^"]*)"/);
      if (m) cur.synonyms.push(m[1]);
    } else if (line.startsWith("relationship: part_of ")) {
      const m = line.match(/^relationship: part_of (\S+)/);
      if (m) cur.partOf.push(m[1]);
    } else if (line.startsWith("is_a: ")) {
      cur.isA.push(line.slice(6).split(" ! ")[0].trim());
    } else if (line.startsWith("xref: FMA:")) {
      cur.fma.push("FMA" + line.slice(6).replace("FMA:", "").trim());
    } else if (line.startsWith("xref: ")) {
      cur.xrefs.push(line.slice(6).trim());
    } else if (line === "") flush();
  }
  flush();
  return { terms, fmaToTerm };
}

async function queryWikidata(fmaIds) {
  const out = new Map();
  const chunk = 250;
  for (let i = 0; i < fmaIds.length; i += chunk) {
    const values = fmaIds
      .slice(i, i + chunk)
      .map((id) => `"${id.replace("FMA", "")}"`)
      .join(" ");
    const q = `SELECT ?item ?fma ?label ?desc ?article ?image WHERE {
      VALUES ?fma { ${values} }
      ?item wdt:P1402 ?fma .
      OPTIONAL { ?item rdfs:label ?label FILTER(lang(?label)="en") }
      OPTIONAL { ?item schema:description ?desc FILTER(lang(?desc)="en") }
      OPTIONAL { ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> }
      OPTIONAL { ?item wdt:P18 ?image }
    }`;
    let data = null;
    for (let attempt = 1; attempt <= 3 && !data; attempt++) {
      const res = await fetch(`${SPARQL}?format=json&query=${encodeURIComponent(q)}`, {
        headers: { "User-Agent": UA, Accept: "application/sparql-results+json" },
      });
      if (res.ok) data = await res.json();
      else {
        console.warn(`wikidata chunk ${i} attempt ${attempt}: ${res.status}`);
        await new Promise((r) => setTimeout(r, 3000 * attempt));
      }
    }
    if (!data) continue;
    for (const row of data.results.bindings) {
      const fma = "FMA" + row.fma.value;
      const entry = out.get(fma) ?? {};
      entry.qid = row.item.value.split("/").pop();
      if (row.label && !entry.label) entry.label = row.label.value;
      if (row.desc && !entry.description) entry.description = row.desc.value;
      if (row.article) entry.wiki = row.article.value;
      if (row.image) entry.image = row.image.value.replace(
        "http://commons.wikimedia.org/wiki/Special:FilePath/",
        "https://commons.wikimedia.org/wiki/Special:FilePath/",
      );
      out.set(fma, entry);
    }
    await new Promise((r) => setTimeout(r, 1600)); // be polite to WDQS
  }
  return out;
}

async function commonsLicenses(files) {
  const out = new Map();
  const batch = 40;
  for (let i = 0; i < files.length; i += batch) {
    const titles = files
      .slice(i, i + batch)
      .map((url) => "File:" + decodeURIComponent(url.split("/Special:FilePath/")[1]).replace(/_/g, " "))
      .join("|");
    const url =
      `${COMMONS_API}?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=400` +
      `&titles=${encodeURIComponent(titles)}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) continue;
    const data = await res.json();
    for (const page of Object.values(data.query?.pages ?? {})) {
      const info = page.imageinfo?.[0] ?? {};
      const meta = info.extmetadata ?? {};
      const artist = (meta.Artist?.value ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      const license = meta.LicenseShortName?.value ?? "";
      // thumburl is a static png/jpg rendition — avoids shipping 20MB animated GIFs
      if (page.title) out.set(page.title, {
        artist, license,
        thumb: info.thumburl ?? "",
        page: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
      });
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return out;
}

const atlas = JSON.parse(await readFile(path.join(ROOT, "public/models/atlas.json"), "utf8"));
const concepts = atlas.concepts;
const byId = new Map(concepts.map((c) => [c.id, c]));

const obo = await loadUberon();
const { fmaToTerm } = parseUberon(obo);

const { terms: uberonTerms } = parseUberon(obo);
const byUberon = new Map([...fmaToTerm.values()].map((t) => [t.id, t]));
const conceptByLowerName = new Map(concepts.map((c) => [c.name.toLowerCase(), c.name]));
function nameOf(uid) {
  const id = uid.split(" ")[0].replace(/[{].*$/, "");
  const term = uberonTerms.get(id) ?? byUberon.get(id);
  if (!term?.name) return null;
  return conceptByLowerName.get(term.name.toLowerCase()) ?? term.name;
}

const fmaIds = concepts.map((c) => c.id);
const wikidata = await queryWikidata(fmaIds);

const imageUrls = [...new Set([...wikidata.values()].map((e) => e.image).filter(Boolean))];
console.log(`fetching licenses for ${imageUrls.length} images`);
const licenses = await commonsLicenses(imageUrls);

const result = {};
let counts = { uberon: 0, definition: 0, wiki: 0, image: 0 };

for (const concept of concepts) {
  const term = fmaToTerm.get(concept.id);
  const wd = wikidata.get(concept.id);
  const entry = {};

  if (term) {
    counts.uberon++;
    entry.uberon = term.id;
    if (term.def) {
      entry.definition = term.def;
      counts.definition++;
    }
    const syns = [...new Set(term.synonyms)].filter(
      (s) => s.toLowerCase() !== concept.name.toLowerCase(),
    );
    if (syns.length) entry.synonyms = syns.slice(0, 6);
    const partOf = [...new Set(term.partOf.map(nameOf))].filter((n) => n && n !== concept.name);
    if (partOf.length) entry.partOf = partOf.slice(0, 6);
    const isA = [...new Set(term.isA.map(nameOf))].filter((n) => n && n !== concept.name);
    if (isA.length) entry.isA = isA.slice(0, 4);
  }

  if (wd?.description) entry.description = wd.description;
  if (wd?.label && wd.label.toLowerCase() !== concept.name.toLowerCase()) entry.label = wd.label;
  if (wd?.wiki) {
    entry.wiki = wd.wiki;
    counts.wiki++;
  }
  // Animated GIFs have no static rendition (15MB+); skip them entirely.
  const imageFile = wd?.image ? decodeURIComponent(wd.image.split("/Special:FilePath/")[1]) : "";
  if (wd?.image && !/\.gif$/i.test(imageFile)) {
    const title = "File:" + imageFile.replace(/_/g, " ");
    const lic = licenses.get(title);
    entry.image = {
      src: lic?.thumb || `${wd.image}?width=640`,
      page: lic?.page ?? "https://commons.wikimedia.org/",
      artist: lic?.artist || "Wikimedia Commons contributor",
      license: lic?.license || "See file page",
    };
    counts.image++;
  }
  if (wd?.qid) entry.wikidata = wd.qid;
  entry.fma = concept.id;

  const useful =
    entry.definition || entry.description || entry.synonyms || entry.partOf || entry.isA || entry.wiki || entry.image;
  if (useful) result[concept.id] = entry;
}

await mkdir(path.join(ROOT, "public/content"), { recursive: true });
await writeFile(
  path.join(ROOT, "public/content/structures.json"),
  JSON.stringify(result, null, 0),
);

console.log("concepts:", concepts.length);
console.log("entries:", Object.keys(result).length);
console.log("uberon matched:", counts.uberon);
console.log("with definition:", counts.definition);
console.log("with wikipedia:", counts.wiki);
console.log("with image:", counts.image);
