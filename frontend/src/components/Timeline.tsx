import { formatDate, type Experience } from '../api';

function period(e: Experience) {
  const start = formatDate(e.startDate, false);
  const end = e.endDate ? formatDate(e.endDate, false) : 'по настоящее время';
  return start ? `${start} — ${end}` : e.endDate ? formatDate(e.endDate, false) : '';
}

export default function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="timeline">
      {items.map((e) => (
        <li key={e.id}>
          <div className="timeline-period">{period(e)}</div>
          <h3>{e.position || e.organization}</h3>
          {e.position && <div className="timeline-org">{e.organization}</div>}
          {e.description && <p className="pre-line">{e.description}</p>}
        </li>
      ))}
    </ol>
  );
}
