# CI — GitHub Actions

Workflow: `.github/workflows/ci.yml`

Status badge (в README):

```markdown
![CI](https://github.com/NikoloDub/qa-playwright-portfolio/actions/workflows/ci.yml/badge.svg)
```

## Jobs

| Job      | Что делает                                                  |
| -------- | ----------------------------------------------------------- |
| **lint** | `npm ci` → ESLint → Prettier check                          |
| **test** | Playwright (13 e2e + 2 visual + 3 api) → Allure → artifacts |

Триггер: `push` / `pull_request` на ветку `main`.

При изменении `apps/web/` visual-тесты (hash-first) поймают неожиданные изменения вёрстки.

## Lint job

Падает, если:

- ESLint errors (warnings в контекстах React — не блокируют)
- **Prettier** — файлы не отформатированы (`npm run format:check`)

Перед push локально:

```bash
npm run lint && npm run format:check
```

## Playwright browsers

**CI:** `npx playwright install --with-deps chromium` — браузер + системные libs Linux.

**Локально:** после `npm install` один раз:

```bash
npx playwright install chromium
```

Без этого e2e/visual падают с `Executable doesn't exist`.

## Переменная `CI=true`

В `playwright.config.ts`:

- `retries: 2`
- `workers: 1`
- `reuseExistingServer: false` — всегда свежий `npm run dev`
- `forbidOnly: true` — `.only` в PR ломает пайплайн

## Visual regression (hash-first)

Helper: `tests/e2e/helpers/visual-hash.ts`  
Эталоны: `tests/e2e/specs/visual.spec.ts-snapshots/{platform}/`

| Платформа | Где используется |
| --------- | ---------------- |
| `darwin/` | Mac локально     |
| `linux/`  | GitHub Actions   |

Файлы: `*.png` (pixel diff) + `*.hash` (быстрый pass).

```bash
npm run test:visual
npm run test:visual:update   # darwin: PNG + .hash
```

Обновление **linux**-эталонов:

```bash
docker run --rm -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble \
  bash -c "npm ci && UPDATE_VISUAL_HASHES=1 npx playwright test --project=visual --update-snapshots"
```

`maxDiffPixelRatio: 0.04` — допуск рендеринга Linux vs Mac.

## Артефакты (14 дней)

Скачать: Actions → run → **Artifacts**

| Artifact            | Содержимое                       |
| ------------------- | -------------------------------- |
| `playwright-report` | HTML-отчёт Playwright            |
| `test-results`      | скриншоты/trace/diff при падении |
| `allure-results`    | сырые данные Allure              |
| `allure-report`     | HTML Allure (`index.html`)       |

Скрин отчёта в README: `docs/assets/allure-report.png`.
