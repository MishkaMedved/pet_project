import { useState, type FormEvent, type ReactNode } from 'react';
import { api } from '../../api';
import { useFetch } from '../../useFetch';
import FileInput from '../../components/FileInput';

export type Field<T> = {
  key: keyof T & string;
  label: string;
  required?: boolean;
  wide?: boolean;
  hint?: string;
} & (
  | { type: 'text' | 'textarea' | 'date' | 'number' }
  | { type: 'select'; options: Record<string, string> }
  | { type: 'file'; accept?: string }
);

interface Props<T extends { id?: number }> {
  title: string;
  /** Public endpoint used for the list, e.g. /api/skills */
  listUrl: string;
  /** Admin endpoint for create/update/delete, e.g. /api/admin/skills */
  adminUrl: string;
  fields: Field<T>[];
  empty: () => T;
  renderItem: (item: T) => ReactNode;
}

export default function CrudSection<T extends { id?: number }>({
  title,
  listUrl,
  adminUrl,
  fields,
  empty,
  renderItem,
}: Props<T>) {
  const { data, error, reload } = useFetch<T[]>(listUrl);
  const [editing, setEditing] = useState<T | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof T, value: unknown) => setEditing((e) => (e ? { ...e, [key]: value } : e));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    setFormError(null);
    try {
      if (editing.id) await api.put(`${adminUrl}/${editing.id}`, editing);
      else await api.post(adminUrl, editing);
      setEditing(null);
      reload();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: T) {
    if (!confirm('Удалить запись? Это действие нельзя отменить.')) return;
    try {
      await api.delete(`${adminUrl}/${item.id}`);
      reload();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  function input(field: Field<T>) {
    const value = editing![field.key] as unknown;
    switch (field.type) {
      case 'textarea':
        return <textarea rows={field.key === 'content' ? 12 : 4} value={(value as string) ?? ''} onChange={(e) => set(field.key, e.target.value || null)} required={field.required} />;
      case 'select':
        return (
          <select value={value as string} onChange={(e) => set(field.key, e.target.value)}>
            {Object.entries(field.options).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        );
      case 'file':
        return <FileInput value={value as string | null} onChange={(v) => set(field.key, v)} accept={field.accept} preview />;
      case 'number':
        return <input type="number" value={(value as number) ?? 0} onChange={(e) => set(field.key, Number(e.target.value))} />;
      default:
        return <input type={field.type} value={(value as string) ?? ''} onChange={(e) => set(field.key, e.target.value || null)} required={field.required} />;
    }
  }

  return (
    <div>
      <div className="admin-section-head">
        <h2>{title}</h2>
        {!editing && (
          <button className="btn" onClick={() => setEditing(empty())}>
            + Добавить
          </button>
        )}
      </div>

      {editing && (
        <form className="card form" onSubmit={save}>
          <h3>{editing.id ? 'Редактирование' : 'Новая запись'}</h3>
          <div className="form-grid">
            {fields.map((f) => (
              <label key={f.key} className={f.wide || f.type === 'textarea' || f.type === 'file' ? 'wide' : ''}>
                {f.label}
                {f.required && ' *'}
                {input(f)}
                {f.hint && <span className="hint">{f.hint}</span>}
              </label>
            ))}
          </div>
          {formError && <div className="form-error">{formError}</div>}
          <div className="form-actions">
            <button className="btn" disabled={busy}>
              {busy ? 'Сохранение…' : 'Сохранить'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>
              Отмена
            </button>
          </div>
        </form>
      )}

      {error && <div className="form-error">{error}</div>}
      {data && data.length === 0 && !editing && <div className="status">Записей пока нет.</div>}
      <ul className="admin-list">
        {data?.map((item) => (
          <li key={item.id} className="card admin-item">
            <div className="admin-item-body">{renderItem(item)}</div>
            <div className="admin-item-actions">
              <button className="btn btn-small btn-outline" onClick={() => setEditing({ ...item })}>
                Изменить
              </button>
              <button className="btn btn-small btn-ghost danger" onClick={() => remove(item)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
