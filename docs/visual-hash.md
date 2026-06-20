# Visual regression — hash-first snapshots

Подход вдохновлён докладом **SQA Days 36** (Владимир Техтилов): сначала быстрое сравнение **perceptual hash**, при расхождении — **попиксельный diff** Playwright для отчёта.

## Как работает

```
Скриншот страницы
       ↓
Perceptual hash (imghash, 16 bit)
       ↓
Сравнение с эталоном *.hash
       ↓
  ┌────┴────┐
  │         │
 hash OK   hash ≠
  │         │
 PASS    toHaveScreenshot()
 (fast)   (pixel diff + attachment)
```

| Фаза  | Скорость | Когда                            |
| ----- | -------- | -------------------------------- |
| Hash  | ~мс      | UI не менялся                    |
| Pixel | ~сек     | Hash изменился — нужен diff в CI |

На 2 тестах выигрыш modest; на 50+ visual — заметнее (в докладе ~11× на один assert, ~2× на весь suite).

## Файлы

```
tests/e2e/specs/visual.spec.ts-snapshots/
├── darwin/
│   ├── login-page.png
│   ├── login-page.hash
│   └── ...
└── linux/          ← CI (GitHub Actions)
    └── ...
```

## Команды

```bash
npm run test:visual                 # прогон
npm run test:visual:update          # обновить PNG + hash эталоны
```

`test:visual:update` выставляет `UPDATE_VISUAL_HASHES=1` и `--update-snapshots`.

## Linux-эталоны для CI

```bash
docker run --rm -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v1.61.0-noble \
  bash -c "npm ci && UPDATE_VISUAL_HASHES=1 npx playwright test --project=visual --update-snapshots"
```

## Ограничения

- Hash **не заменяет** pixel diff — только ускоряет happy path.
- Perceptual hash может дать **false positive** — fallback на pixel обязателен.
- Динамические блоки — маскируй через Playwright `mask` или стабильные mock-данные.
- Алгоритм в докладе — Wavelet hash; здесь **block mean hash** (`imghash`) — проще в Node.js.

## Код

Helper: `tests/e2e/helpers/visual-hash.ts`  
Spec: `tests/e2e/specs/visual.spec.ts`
