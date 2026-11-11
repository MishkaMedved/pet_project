import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { api, type Profile } from '../../api';
import FileInput from '../../components/FileInput';

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<Profile>('/api/profile').then(setProfile);
  }, []);

  if (!profile) return <div className="status">Загрузка…</div>;

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => setProfile({ ...profile, [key]: value });
  const text = (key: 'fullName' | 'headline' | 'email' | 'phone' | 'location') => ({
    value: profile[key] ?? '',
    onChange: (e: ChangeEvent<HTMLInputElement>) => set(key, e.target.value),
  });

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const links = profile!.socialLinks.filter((l) => l.name.trim() && l.url.trim());
      setProfile(await api.put<Profile>('/api/admin/profile', { ...profile, socialLinks: links }));
      setMessage({ ok: true, text: 'Сохранено' });
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card form" onSubmit={save}>
      <h2>Профиль</h2>
      <div className="form-grid">
        <label>
          Имя и фамилия *
          <input {...text('fullName')} required />
        </label>
        <label>
          Должность / подзаголовок
          <input {...text('headline')} placeholder="Журналист · SMM-менеджер" />
        </label>
        <label>
          Email
          <input type="email" {...text('email')} />
        </label>
        <label>
          Телефон
          <input {...text('phone')} />
        </label>
        <label>
          Город
          <input {...text('location')} />
        </label>
      </div>
      <label>
        О себе
        <textarea rows={6} value={profile.bio ?? ''} onChange={(e) => set('bio', e.target.value)} />
      </label>
      <label>
        Фото
        <FileInput value={profile.photoUrl} onChange={(v) => set('photoUrl', v)} accept="image/*" preview />
      </label>
      <label>
        Резюме для скачивания (PDF, DOC)
        <FileInput value={profile.resumeFileUrl} onChange={(v) => set('resumeFileUrl', v)} accept=".pdf,.doc,.docx" />
      </label>

      <fieldset>
        <legend>Соцсети и ссылки</legend>
        {profile.socialLinks.map((link, i) => (
          <div className="link-row" key={i}>
            <input
              placeholder="Название (Telegram, VK…)"
              value={link.name}
              onChange={(e) =>
                set('socialLinks', profile.socialLinks.map((l, j) => (j === i ? { ...l, name: e.target.value } : l)))
              }
            />
            <input
              placeholder="https://…"
              value={link.url}
              onChange={(e) =>
                set('socialLinks', profile.socialLinks.map((l, j) => (j === i ? { ...l, url: e.target.value } : l)))
              }
            />
            <button
              type="button"
              className="btn btn-small btn-ghost"
              onClick={() => set('socialLinks', profile.socialLinks.filter((_, j) => j !== i))}
            >
              Удалить
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-small btn-outline"
          onClick={() => set('socialLinks', [...profile.socialLinks, { name: '', url: '' }])}
        >
          + Добавить ссылку
        </button>
      </fieldset>

      <div className="form-actions">
        <button className="btn" disabled={busy}>
          {busy ? 'Сохранение…' : 'Сохранить'}
        </button>
        {message && <span className={message.ok ? 'form-ok' : 'form-error'}>{message.text}</span>}
      </div>
    </form>
  );
}
