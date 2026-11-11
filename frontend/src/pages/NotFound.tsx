import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow center">
        <h1 className="page-title">Страница не найдена</h1>
        <Link to="/" className="btn">
          На главную
        </Link>
      </div>
    </section>
  );
}
