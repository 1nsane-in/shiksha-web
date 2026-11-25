import { ArrowUpRight } from "lucide-react";
import type { GeneratedStructure } from "./structure-reference";

function Chips({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="detail-section">
      <h3>{title}</h3>
      <div className="chip-row">
        {items.map((item) => (
          <span className="detail-chip" key={item}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Auto-generated reference block: invented from open ontologies, shown under
 * the curated sections (or on its own when no curated entry exists).
 */
export function StructureReferenceSections({ entry }: { entry: GeneratedStructure }) {
  const partOf = entry.partOf ?? [];
  const classes = (entry.isA ?? []).filter((item) => !partOf.includes(item));

  const links = [
    entry.wiki && { href: entry.wiki, label: "Wikipedia article" },
    entry.uberon && {
      href: `https://www.ebi.ac.uk/ols4/ontologies/uberon/terms?iri=http://purl.obolibrary.org/obo/${entry.uberon.replace(":", "_")}`,
      label: "Uberon ontology",
    },
    entry.wikidata && { href: `https://www.wikidata.org/wiki/${entry.wikidata}`, label: "Wikidata" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <div className="structure-detail">
      {entry.image && (
        <figure className="detail-figure">
          <img src={entry.image.src} alt={entry.label ?? "Anatomical reference image"} loading="lazy" />
          <figcaption>
            <a href={entry.image.page} target="_blank" rel="noreferrer">
              {entry.image.artist} · {entry.image.license}
            </a>
          </figcaption>
        </figure>
      )}
      {entry.definition && (
        <div className="detail-section">
          <h3>Ontology definition</h3>
          <p>{entry.definition}</p>
        </div>
      )}
      <Chips title="Also known as" items={entry.synonyms ?? []} />
      <Chips title="Part of" items={partOf} />
      <Chips title="Classified as" items={classes} />
      {links.length > 0 && (
        <div className="detail-section">
          <h3>Reference links</h3>
          <div className="link-list">
            {links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        </div>
      )}
      <p className="detail-sources">
        Data: Uberon (CC BY 3.0) · Wikidata (CC0) · Wikimedia Commons (see image page)
      </p>
    </div>
  );
}
