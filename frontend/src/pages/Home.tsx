import { Link, useOutletContext } from 'react-router';
import type { Profile, Publication } from '../api';
import { useFetch } from '../useFetch';
import PublicationCard from '../components/PublicationCard';

export default function Home() {
  const profile = useOutletContext<Profile | null>();
  const { data: publications } = useFetch<Publication[]>('/api/publications');
  const latest = publications?.slice(0, 3) ?? [];

  if (!profile) return <div className="status">Загрузка…</div>;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="eyebrow">{profile.headline}</p>
            <h1>{profile.fullName}</h1>
            {profile.bio && <p className="lead pre-line">{profile.bio}</p>}
            <div className="hero-actions">
              {profile.email && (
                <a className="btn" href={`mailto:${profile.email}`}>
                  Написать мне
                </a>
              )}
              {profile.resumeFileUrl && (
                <a className="btn btn-outline" href={profile.resumeFileUrl} target="_blank" rel="noreferrer">
                  Скачать резюме
                </a>
              )}
            </div>
            <ul className="contact-list">
              {profile.location && <li>{profile.location}</li>}
              {profile.phone && (
                <li>
                  <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a>
                </li>
              )}
              {profile.socialLinks.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noreferrer">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="hero-photo">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.fullName} />
            ) : (
              <div className="photo-placeholder">
                {profile.fullName
                  .split(' ')
                  .map((w) => w[0])
                  .join('')}
              </div>
            )}
          </div>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Последние публикации</h2>
              <Link to="/publications" className="link-arrow">
                Все публикации →
              </Link>
            </div>
            <div className="pub-grid">
              {latest.map((p) => (
                <PublicationCard key={p.id} publication={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
