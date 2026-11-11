import { useState } from 'react';
import { api } from '../api';

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  preview?: boolean;
}

/** Uploads the chosen file right away and reports its URL; a link can also be pasted by hand. */
export default function FileInput({ value, onChange, accept, preview }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange((await api.upload(file)).url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const isImage = value && /\.(jpe?g|png|webp|gif)$/i.test(value);

  return (
    <div className="file-input">
      {preview && isImage && <img src={value} alt="" className="file-preview" />}
      <div className="file-row">
        <input
          type="text"
          value={value ?? ''}
          placeholder="Загрузите файл или вставьте ссылку"
          onChange={(e) => onChange(e.target.value || null)}
        />
        <label className="btn btn-small btn-outline">
          {uploading ? 'Загрузка…' : 'Выбрать файл'}
          <input type="file" accept={accept} hidden disabled={uploading} onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
        {value && (
          <button type="button" className="btn btn-small btn-ghost" onClick={() => onChange(null)}>
            Убрать
          </button>
        )}
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
