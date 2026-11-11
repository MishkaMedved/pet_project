import { Link, useParams } from 'react-router';
import { CATEGORY_LABELS, formatDate, type Publication } from '../api';
import { useFetch } from '../useFetch';
import { ErrorMessage, Loading } from '../components/Status';

export default function PublicationPage() {
  const { id } = useParams();
  const { data: p, error } = useFetch<Publication>(`/api/publications/${id}`);

  if (error) return <div className="container section"><ErrorMessage message={error} /></div>;
  if (!p) return <Loading />;

  return (
    <article className="section">
      <div className="container narrow">
        <Link to="/publications" className="link-arrow">
          ← Все публикации
        </Link>
        <div className="pub-meta article-meta">
          <span className="tag">{CATEGORY_LABELS[p.category]}</span>
          {p.outlet && <span>{p.outlet}</span>}
          {p.publishedAt && <span>{formatDate(p.publishedAt)}</span>}
        </div>
        <h1 className="article-title">{p.title}</h1>
        {p.summary && <p className="lead">{p.summary}</p>}
        {p.coverUrl && <img className="article-cover" src={p.coverUrl} alt="" />}
        {p.content && <div className="article-content pre-line">{p.content}</div>}
        {p.externalUrl && (
          <a className="btn" href={p.externalUrl} target="_blank" rel="noreferrer">
            Читать в источнике
          </a>
        )}
      </div>
    </article>
  );
}
