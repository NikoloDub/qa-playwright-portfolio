# Allure — локально и CI

## Требования

- **Java 8+** — для `allure:generate` и `allure:open` (CLI `allure-commandline`)
- Playwright пишет сырые результаты в `allure-results/` после `npm test`

## Локально

```bash
npm test                  # 18 тестов → allure-results/
npm run allure:generate   # allure-report/
npm run allure:open       # открыть в браузере
```

Или одной цепочкой:

```bash
npm run test:allure
npm run allure:open
```

## CI (GitHub Actions)

Уже настроено в `.github/workflows/ci.yml`:

1. `npm test` с `CI=true`
2. `npm run allure:generate`
3. Upload artifacts: `allure-results`, `allure-report`

Скачать: Actions → Run → Artifacts → `allure-report` → открыть `index.html`.

Пример отчёта (18 passed): см. `docs/assets/allure-report.png` в README.

## GitHub Pages (опционально)

Постоянная ссылка на отчёт в README — см. [`roadmap.md`](./roadmap.md).

## Папки

| Папка             | Содержимое             | Git    |
| ----------------- | ---------------------- | ------ |
| `allure-results/` | JSON/XML от Playwright | ignore |
| `allure-report/`  | HTML-отчёт             | ignore |

## Что видно в отчёте

| Тип теста | Project Playwright | Примеры suite                           |
| --------- | ------------------ | --------------------------------------- |
| E2E UI    | `chromium`         | Authentication, Cart, Catalog, …        |
| Visual    | `visual`           | Visual regression (hash-first)          |
| API       | `api`              | POST /api/auth/login, GET /api/products |
