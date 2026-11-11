import { useEffect, useState } from 'react';
import { MEDIA_LABELS, youtubeEmbed, type MediaItem, type MediaType } from '../api';
import { useFetch } from '../useFetch';
import { Empty, ErrorMessage, Loading } from '../components/Status';

const TYPES: MediaType[] = ['PHOTO', 'VIDEO', 'DOCUMENT'];

function Video({ item }: { item: MediaItem }) {
  const embed = youtubeEmbed(item.url);
  if (embed) {
    return <iframe src={embed} title={item.title ?? 'Видео'} allowFullScreen loading="lazy" />;
  }
  if (item.url.startsWith('/uploads/')) {
    return <video src={item.url} controls preload="metadata" />;
  }
  return (
    <a className="video-link" href={item.url} target="_blank" rel="noreferrer">
      ▶ Смотреть видео
    </a>
  );
}

export default function Gallery() {
  const { data, error } = useFetch<MediaItem[]>('/api/media');
  const [type, setType] = useState<MediaType | null>(null);
  const [open, setOpen] = useState<MediaItem | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const present = TYPES.filter((t) => data?.some((m) => m.type === t));
  const shown = data?.filter((m) => !type || m.type === type) ?? [];
  const photos = shown.filter((m) => m.type === 'PHOTO');
  const videos = shown.filter((m) => m.type === 'VIDEO');
  const documents = shown.filter((m) => m.type === 'DOCUMENT');

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Галерея</h1>
        {present.length > 1 && (
          <div className="filters">
            <button className={!type ? 'active' : ''} onClick={() => setType(null)}>
              Всё
            </button>
            {present.map((t) => (
              <button key={t} className={type === t ? 'active' : ''} onClick={() => setType(t)}>
                {MEDIA_LABELS[t]}
              </button>
            ))}
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {!data && !error && <Loading />}
        {data && shown.length === 0 && <Empty>Здесь пока пусто.</Empty>}

        {photos.length > 0 && (
          <div className="photo-grid">
            {photos.map((m) => (
              <button key={m.id} className="photo-item" onClick={() => setOpen(m)}>
                <img src={m.url} alt={m.title ?? ''} loading="lazy" />
                {m.title && <span className="photo-caption">{m.title}</span>}
              </button>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <div className="video-grid">
            {videos.map((m) => (
              <figure key={m.id} className="video-item">
                <div className="video-frame">
                  <Video item={m} />
                </div>
                {(m.title || m.description) && (
                  <figcaption>
                    {m.title && <strong>{m.title}</strong>}
                    {m.description && <p className="muted">{m.description}</p>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        {documents.length > 0 && (
          <ul className="doc-list">
            {documents.map((m) => (
              <li key={m.id}>
                <a href={m.url} target="_blank" rel="noreferrer">
                  <span className="doc-icon">PDF</span>
                  <span>
                    <strong>{m.title || 'Документ'}</strong>
                    {m.description && <span className="muted"> — {m.description}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <button className="lightbox-close" aria-label="Закрыть">×</button>
          <img src={open.url} alt={open.title ?? ''} onClick={(e) => e.stopPropagation()} />
          {(open.title || open.description) && (
            <div className="lightbox-caption">
              {open.title && <strong>{open.title}</strong>} {open.description}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
