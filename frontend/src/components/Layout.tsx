import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import type { Profile } from '../api';
import { useFetch } from '../useFetch';

const NAV = [
  { to: '/', label: 'Обо мне', end: true },
  { to: '/publications', label: 'Публикации' },
  { to: '/experience', label: 'Опыт' },
  { to: '/gallery', label: 'Галерея' },
];

export default function Layout() {
  const { data: profile } = useFetch<Profile>('/api/profile');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="site">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            {profile?.fullName ?? 'Вероника Сыкулева'}
          </Link>
          <button
            className="menu-toggle"
            aria-label="Меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet context={profile} />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="footer-name">{profile?.fullName}</div>
            <div className="muted">{profile?.headline}</div>
          </div>
          <div className="footer-contacts">
            {profile?.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
            {profile?.phone && <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a>}
            {profile?.socialLinks.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
                {l.name}
              </a>
            ))}
          </div>
        </div>
        <div className="container copyright">© {new Date().getFullYear()} {profile?.fullName}</div>
      </footer>
    </div>
  );
}
