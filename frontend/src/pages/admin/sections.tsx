import {
  CATEGORY_LABELS,
  EXPERIENCE_LABELS,
  MEDIA_LABELS,
  formatDate,
  type Experience,
  type MediaItem,
  type Publication,
  type Skill,
} from '../../api';
import CrudSection from './CrudSection';

export function PublicationsAdmin() {
  return (
    <CrudSection<Publication>
      title="Публикации и кейсы"
      listUrl="/api/publications"
      adminUrl="/api/admin/publications"
      empty={() => ({
        title: '',
        category: 'ARTICLE',
        outlet: null,
        summary: null,
        content: null,
        coverUrl: null,
        externalUrl: null,
        publishedAt: null,
      })}
      fields={[
        { key: 'title', label: 'Заголовок', type: 'text', required: true, wide: true },
        { key: 'category', label: 'Тип', type: 'select', options: CATEGORY_LABELS },
        { key: 'outlet', label: 'Издание / клиент', type: 'text' },
        { key: 'publishedAt', label: 'Дата публикации', type: 'date' },
        { key: 'externalUrl', label: 'Ссылка на оригинал', type: 'text' },
        { key: 'coverUrl', label: 'Обложка', type: 'file', accept: 'image/*' },
        { key: 'summary', label: 'Краткое описание (для карточки)', type: 'textarea' },
        { key: 'content', label: 'Текст материала / описание кейса', type: 'textarea' },
      ]}
      renderItem={(p) => (
        <>
          <strong>{p.title}</strong>
          <div className="muted small">
            {CATEGORY_LABELS[p.category]}
            {p.outlet && ` · ${p.outlet}`}
            {p.publishedAt && ` · ${formatDate(p.publishedAt)}`}
          </div>
        </>
      )}
    />
  );
}

export function ExperienceAdmin() {
  return (
    <CrudSection<Experience>
      title="Опыт и образование"
      listUrl="/api/experience"
      adminUrl="/api/admin/experience"
      empty={() => ({
        type: 'WORK',
        organization: '',
        position: null,
        description: null,
        startDate: null,
        endDate: null,
        sortOrder: 0,
      })}
      fields={[
        { key: 'type', label: 'Тип', type: 'select', options: EXPERIENCE_LABELS },
        { key: 'organization', label: 'Организация / учебное заведение', type: 'text', required: true },
        { key: 'position', label: 'Должность / специальность', type: 'text' },
        { key: 'startDate', label: 'Начало', type: 'date' },
        { key: 'endDate', label: 'Окончание', type: 'date', hint: 'Оставьте пустым, если по настоящее время' },
        { key: 'sortOrder', label: 'Порядок', type: 'number', hint: 'Меньше — выше в списке' },
        { key: 'description', label: 'Описание, обязанности, достижения', type: 'textarea' },
      ]}
      renderItem={(e) => (
        <>
          <strong>{e.position || e.organization}</strong>
          <div className="muted small">
            {EXPERIENCE_LABELS[e.type]}
            {e.position && ` · ${e.organization}`}
            {e.startDate && ` · с ${formatDate(e.startDate, false)}`}
            {e.endDate && ` по ${formatDate(e.endDate, false)}`}
          </div>
        </>
      )}
    />
  );
}

export function SkillsAdmin() {
  return (
    <CrudSection<Skill>
      title="Навыки"
      listUrl="/api/skills"
      adminUrl="/api/admin/skills"
      empty={() => ({ name: '', category: null, sortOrder: 0 })}
      fields={[
        { key: 'name', label: 'Навык', type: 'text', required: true },
        { key: 'category', label: 'Группа', type: 'text', hint: 'Например: «Журналистика», «SMM», «Инструменты»' },
        { key: 'sortOrder', label: 'Порядок', type: 'number' },
      ]}
      renderItem={(s) => (
        <>
          <strong>{s.name}</strong>
          {s.category && <div className="muted small">{s.category}</div>}
        </>
      )}
    />
  );
}

export function MediaAdmin() {
  return (
    <CrudSection<MediaItem>
      title="Галерея: фото, видео, документы"
      listUrl="/api/media"
      adminUrl="/api/admin/media"
      empty={() => ({ type: 'PHOTO', title: null, description: null, url: '' })}
      fields={[
        { key: 'type', label: 'Тип', type: 'select', options: MEDIA_LABELS },
        { key: 'title', label: 'Подпись', type: 'text' },
        {
          key: 'url',
          label: 'Файл или ссылка',
          required: true,
          type: 'file',
          accept: 'image/*,video/*,.pdf,.doc,.docx',
          hint: 'Для видео можно вставить ссылку на YouTube, VK или Rutube',
        },
        { key: 'description', label: 'Описание', type: 'textarea' },
      ]}
      renderItem={(m) => (
        <div className="media-row">
          {m.type === 'PHOTO' && <img src={m.url} alt="" className="thumb" />}
          <div>
            <strong>{m.title || m.url.split('/').pop()}</strong>
            <div className="muted small">{MEDIA_LABELS[m.type]}</div>
          </div>
        </div>
      )}
    />
  );
}
