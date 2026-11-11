import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { api, auth } from '../../api';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { token } = await api.login(username, password);
      auth.set(token);
      navigate('/admin');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={submit}>
        <h1>Вход в админ-панель</h1>
        <label>
          Логин
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="btn" disabled={busy}>
          {busy ? 'Вход…' : 'Войти'}
        </button>
        <a href="/" className="muted small">
          ← Вернуться на сайт
        </a>
      </form>
    </div>
  );
}
