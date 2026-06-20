# Docker — тестовое окружение QA Shop

Один стенд для ревьюера или manual QA без установки Node.js локально (нужен только Docker).

## Быстрый старт

```bash
docker compose up --build -d
```

| Сервис   | URL                              |
| -------- | -------------------------------- |
| Web (UI) | http://localhost:5173            |
| API      | http://localhost:3001/api/health |

Логин: `demo` / `demo123`

```bash
docker compose logs -f      # логи
docker compose down         # остановить
docker compose down -v      # остановить + volumes (если появятся)
```

Npm-обёртки из корня:

```bash
npm run docker:up
npm run docker:down
npm run docker:logs
```

## Архитектура

```
docker compose
├── api   Node 20 Alpine → Express :3001
└── web   Nginx → статика Vite build, proxy /api → api:3001
```

- **Multi-stage build** — образы без devDependencies и исходников
- **healthcheck** на API — web стартует после готовности API
- **nginx** — SPA routing (`try_files`) + reverse proxy для API

## Локальная разработка vs Docker

| Режим                             | Когда                                                      |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Разработка, hot reload                                     |
| `docker compose up`               | Демо ревьюеру, «чистое» окружение                          |
| `npm test`                        | Автотесты (Playwright поднимает app; Docker не обязателен) |
| `npx playwright install chromium` | Первый раз после `npm install`                             |

## Troubleshooting

| Проблема                                | Решение                                                          |
| --------------------------------------- | ---------------------------------------------------------------- |
| `Executable doesn't exist` (Playwright) | `npx playwright install chromium`                                |
| Порт 5173/3001 занят                    | `lsof -i :5173` → остановить процесс или сменить ports в compose |
| Web без товаров                         | `docker compose logs api` — API не поднялся                      |
| Пересборка после изменений              | `docker compose up --build -d`                                   |
| CI упал на Prettier                     | `npm run format` локально, закоммитить                           |

## Прогон e2e против Docker-стенда (опционально)

```bash
docker compose up --build -d
# временно в playwright.config.ts baseURL = http://127.0.0.1:5173
# закомментировать webServer и запустить:
npm run test:e2e
```

Для CI используется `webServer` в Playwright — Docker в Actions не обязателен.
