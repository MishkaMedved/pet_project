import type { Experience, Skill } from '../api';
import { useFetch } from '../useFetch';
import Timeline from '../components/Timeline';
import { Empty, ErrorMessage, Loading } from '../components/Status';

export default function ExperiencePage() {
  const { data: experience, error } = useFetch<Experience[]>('/api/experience');
  const { data: skills } = useFetch<Skill[]>('/api/skills');

  const work = experience?.filter((e) => e.type === 'WORK') ?? [];
  const education = experience?.filter((e) => e.type === 'EDUCATION') ?? [];

  const skillGroups = new Map<string, Skill[]>();
  skills?.forEach((s) => {
    const key = s.category || 'Навыки';
    skillGroups.set(key, [...(skillGroups.get(key) ?? []), s]);
  });

  return (
    <section className="section">
      <div className="container">
        <h1 className="page-title">Опыт и навыки</h1>
        {error && <ErrorMessage message={error} />}
        {!experience && !error && <Loading />}
        {experience && experience.length === 0 && !skills?.length && <Empty>Информация скоро появится.</Empty>}

        <div className="experience-grid">
          <div>
            {work.length > 0 && (
              <>
                <h2>Опыт работы</h2>
                <Timeline items={work} />
              </>
            )}
            {education.length > 0 && (
              <>
                <h2>Образование</h2>
                <Timeline items={education} />
              </>
            )}
          </div>
          {skillGroups.size > 0 && (
            <aside className="skills">
              {[...skillGroups].map(([group, items]) => (
                <div key={group} className="skill-group">
                  <h3>{group}</h3>
                  <ul className="chips">
                    {items.map((s) => (
                      <li key={s.id}>{s.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
