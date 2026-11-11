import { useState } from 'react';
import { CATEGORY_LABELS, type Publication, type PublicationCategory } from '../api';
import { useFetch } from '../useFetch';
import PublicationCard from '../components/PublicationCard';
import { Empty, ErrorMessage, Loading } from '../components/Status';

export default function Publications() {
  const { data, error } = useFetch<Publication[]>('/api/publications');
  const [category, setCategory] = useState<PublicationCategory | null>(null);

  const present = [...new Set(data?.map((p) => p.category))];
  const shown = data?.filter((p) => !category || p.category === category) ?? [];

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Публикации</h1>
        {present.length > 1 && (
          <div className="filters">
            <button className={!category ? 'active' : ''} onClick={() => setCategory(null)}>
              Все
            </button>
            {present.map((c) => (
              <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        )}
        {error ? (
          <ErrorMessage message={error} />
        ) : !data ? (
          <Loading />
        ) : shown.length === 0 ? (
          <Empty>Публикаций пока нет.</Empty>
        ) : (
          <div className="pub-grid">
            {shown.map((p) => (
              <PublicationCard key={p.id} publication={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
