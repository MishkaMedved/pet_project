import { useState, type FormEvent } from 'react';
import { api } from '../../api';

export default function AccountAdmin() {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [repeat, setRepeat] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== repeat) {
      setMessage({ ok: false, text: 'Пароли не совпадают' });
      return;
    }
    try {
      await api.put('/api/admin/account/password', { currentPassword, newPassword });
      setMessage({ ok: true, text: 'Пароль изменён' });
      setCurrent('');
      setNew('');
      setRepeat('');
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    }
  }

  return (
    <form className="card form narrow-form" onSubmit={submit}>
      <h2>Смена пароля</h2>
      <label>
        Текущий пароль
        <input type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required />
      </label>
      <label>
        Новый пароль (не короче 8 символов)
        <input type="password" minLength={8} value={newPassword} onChange={(e) => setNew(e.target.value)} required />
      </label>
      <label>
        Повторите новый пароль
        <input type="password" value={repeat} onChange={(e) => setRepeat(e.target.value)} required />
      </label>
      <div className="form-actions">
        <button className="btn">Сменить пароль</button>
        {message && <span className={message.ok ? 'form-ok' : 'form-error'}>{message.text}</span>}
      </div>
    </form>
  );
}
