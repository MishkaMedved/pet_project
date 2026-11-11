# Сайт-резюме Вероники Сыкулевой

Сайт-портфолио журналиста и SMM-менеджера: посетители просматривают материалы, владелец сайта
наполняет его через админ-панель.

- **Backend** — Java 17, Spring Boot 4, Spring Security (JWT), Spring Data JPA, Flyway, PostgreSQL
- **Frontend** — React 19, TypeScript, Vite, React Router (`frontend/`)
- **Запуск** — Docker Compose: PostgreSQL + Spring Boot + nginx с React

## Разделы сайта

| Раздел      | Что внутри                                                                 |
|-------------|----------------------------------------------------------------------------|
| Обо мне     | Фото, имя, должность, биография, контакты, соцсети, кнопка «Скачать резюме» |
| Публикации  | Статьи, интервью, репортажи, SMM-кейсы с обложкой, текстом и ссылкой на оригинал |
| Опыт        | Места работы, образование (таймлайн), навыки по группам                    |
| Галерея     | Фото (с просмотром в полный экран), видео (файлы или YouTube), документы    |

Админ-панель: `/admin` — профиль, публикации, опыт, навыки, галерея, смена пароля.

## Запуск в продакшене

```bash
cp .env.example .env     # заполнить пароли и JWT_SECRET (openssl rand -base64 48)
docker compose up -d --build
```

Сайт откроется на порту `HTTP_PORT` (по умолчанию 80). Учётная запись администратора создаётся
при первом запуске из `ADMIN_USERNAME` / `ADMIN_PASSWORD`; дальше пароль меняется в админке
(вкладка «Пароль»), и переменная `ADMIN_PASSWORD` больше не используется.

Данные хранятся в Docker-томах: `pgdata` (база) и `uploads` (загруженные файлы) — их нужно
включить в резервное копирование. HTTPS удобнее всего настроить внешним reverse-proxy
(Caddy, nginx + certbot) перед контейнером `frontend`.

## Локальная разработка

```bash
docker compose up -d db          # только PostgreSQL (нужен DB_PASSWORD в .env)
DB_PASSWORD=... ./gradlew bootRun   # backend на :8080, логин admin / admin по умолчанию
cd frontend && npm install && npm run dev   # frontend на :5173, проксирует /api и /uploads
```

Порт 5432 у `db` по умолчанию наружу не открыт — для локальной разработки добавьте
`ports: ["5432:5432"]` в `docker-compose.yml` или используйте локальный PostgreSQL.

Тесты: `./gradlew test` (используют H2 в памяти, Docker не нужен).

## API

Публичные (GET): `/api/profile`, `/api/publications[?category=]`, `/api/publications/{id}`,
`/api/experience`, `/api/skills`, `/api/media[?type=]`, файлы — `/uploads/**`.

Админские (требуют `Authorization: Bearer <token>` из `POST /api/auth/login`):
`PUT /api/admin/profile`, CRUD на `/api/admin/{publications|experience|skills|media}`,
`POST /api/admin/files` (multipart, поле `file`), `PUT /api/admin/account/password`.
