import { Link } from 'react-router';
import { CATEGORY_LABELS, formatDate, type Publication } from '../api';

export default function PublicationCard({ publication: p }: { publication: Publication }) {
  return (
    <Link to={`/publications/${p.id}`} className="pub-card">
      <div className="pub-cover">
        {p.coverUrl ? <img src={p.coverUrl} alt="" loading="lazy" /> : <div className="pub-cover-placeholder">{p.title[0]}</div>}
      </div>
      <div className="pub-body">
        <div className="pub-meta">
          <span className="tag">{CATEGORY_LABELS[p.category]}</span>
          {p.outlet && <span>{p.outlet}</span>}
        </div>
        <h3>{p.title}</h3>
        {p.summary && <p className="muted clamp">{p.summary}</p>}
        {p.publishedAt && <div className="pub-date">{formatDate(p.publishedAt)}</div>}
      </div>
    </Link>
  );
}
