import { Navigate, NavLink, Outlet, useNavigate } from 'react-router';
import { auth } from '../../api';

const TABS = [
  { to: 'profile', label: 'Профиль' },
  { to: 'publications', label: 'Публикации' },
  { to: 'experience', label: 'Опыт и образование' },
  { to: 'skills', label: 'Навыки' },
  { to: 'media', label: 'Галерея' },
  { to: 'account', label: 'Пароль' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  if (!auth.token()) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="container header-inner">
          <span className="logo">Админ-панель</span>
          <div className="admin-actions">
            <a href="/" target="_blank" rel="noreferrer">
              Открыть сайт ↗
            </a>
            <button
              className="btn btn-small btn-outline"
              onClick={() => {
                auth.clear();
                navigate('/admin/login');
              }}
            >
              Выйти
            </button>
          </div>
        </div>
        <nav className="container admin-tabs">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to}>
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="container admin-main">
        <Outlet />
      </main>
    </div>
  );
}
