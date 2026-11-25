import type { StructureDetail } from './structure-details';

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="detail-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Extended reference sections shown under the summary when a structure has
 * curated content in structure-details.ts.
 */
export function StructureDetailSections({ detail }: { detail: StructureDetail }) {
  return (
    <div className="structure-detail">
      {detail.quickFacts && detail.quickFacts.length > 0 && (
        <dl className="fact-grid">
          {detail.quickFacts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <Section title="Parts" items={detail.parts ?? []} />
      <Section title="Articulations" items={detail.articulations ?? []} />
      <Section title="Key features" items={detail.features ?? []} />
      {detail.development && (
        <div className="detail-section">
          <h3>Development</h3>
          <p>{detail.development}</p>
        </div>
      )}
      <Section title="Clinical significance" items={detail.clinical ?? []} />
      {detail.bloodSupply && (
        <div className="detail-section">
          <h3>Blood supply</h3>
          <p>{detail.bloodSupply}</p>
        </div>
      )}
      {detail.nerveSupply && (
        <div className="detail-section">
          <h3>Nerve supply</h3>
          <p>{detail.nerveSupply}</p>
        </div>
      )}
      {detail.sources && detail.sources.length > 0 && (
        <p className="detail-sources">Sources: {detail.sources.join(' · ')}</p>
      )}
    </div>
  );
}
