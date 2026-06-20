# Roadmap — следующие шаги

Проект готов для портфолио. Ниже — идеи доработки по приоритету.

## Сделано

- Monorepo: React + Express + Playwright (POM, fixtures)
- **18 автотестов:** 13 e2e UI + 2 visual + 3 API
- Visual regression: **hash-first** (perceptual hash → pixel diff fallback), Login + Catalog
- Эталоны `darwin/` и `linux/` (PNG + `.hash`)
- CI: lint (ESLint + Prettier) → test → Allure artifacts
- Docker Compose, ESLint/Prettier, README + test-plan + docs

## Ближайшие улучшения

### 1. Pre-commit hooks

`husky` + `lint-staged` — lint/format перед коммитом, чтобы CI не падал на Prettier.

### 2. CI path filters (опционально)

Запускать полный CI только при изменении релевантных путей:

```yaml
paths:
  - 'apps/**'
  - 'tests/**'
  - 'playwright.config.ts'
  - 'package.json'
```

### 3. Node 22 в CI

Убрать deprecation warning GitHub Actions (сейчас Node 20).

### 4. GitHub Pages для Allure

Постоянная ссылка на отчёт в README вместо скачивания artifact.

### 5. Расширение покрытия

- Visual: Cart, Checkout
- API: health, 400 на пустой login body
- E2E: мобильный viewport (project `mobile-chrome`)
- Теги `@smoke` / `@regression` для выборочного прогона в CI

### 6. Docker в CI (опционально)

Поднимать стенд через `docker compose` вместо `webServer` — ближе к prod-like, но дольше по времени.
