# Тест-план — QA Shop

Pet-проект для портфолио Manual + Automation QA.  
Стенд: локальное приложение (Vite + Express), не внешний прод.

**Учётные данные:** `demo` / `demo123`

**Всего автотестов:** 18 (13 e2e UI + 2 visual + 3 API)

---

## E2E (Playwright, project `chromium`)

| #   | Сценарий                                                      | Тип            | Spec               | Приоритет |
| --- | ------------------------------------------------------------- | -------------- | ------------------ | --------- |
| 1   | Успешный логин валидным пользователем                         | positive       | `auth.spec.ts`     | High      |
| 2   | Логин с неверным паролем — сообщение об ошибке                | negative       | `auth.spec.ts`     | High      |
| 3   | Logout — редирект на login, защищённые страницы недоступны    | positive       | `auth.spec.ts`     | High      |
| 4   | Каталог: отображение списка товаров (≥3)                      | smoke          | `catalog.spec.ts`  | High      |
| 5   | Фильтр/поиск по названию товара                               | functional     | `catalog.spec.ts`  | Medium    |
| 6   | Сортировка по цене (возрастание)                              | functional     | `catalog.spec.ts`  | Medium    |
| 7   | Добавить товар в корзину — счётчик +1                         | positive       | `cart.spec.ts`     | High      |
| 8   | Удалить из корзины — корзина пуста                            | positive       | `cart.spec.ts`     | High      |
| 9   | Оформление заказа с валидной формой — success page            | positive       | `checkout.spec.ts` | High      |
| 10  | Оформление с пустым обязательным полем — валидация            | negative       | `checkout.spec.ts` | Medium    |
| 11  | Профиль: смена display name — сохраняется после reload        | functional     | `profile.spec.ts`  | Medium    |
| 12  | Доступ к `/cart` без авторизации → login; unknown route → 404 | security/smoke | `security.spec.ts` | High      |

---

## API (Playwright `request`, project `api`)

| ID  | Сценарий               | Метод | Эндпоинт          | Ожидаемый результат                                    | Spec                   |
| --- | ---------------------- | ----- | ----------------- | ------------------------------------------------------ | ---------------------- |
| A1  | Список товаров         | GET   | `/api/products`   | 200, массив ≥3, поля `id`, `name`, `price`, `category` | `products.api.spec.ts` |
| A2  | Логин — неверные creds | POST  | `/api/auth/login` | 401, `{ message }`                                     | `auth.api.spec.ts`     |
| A3  | Логин — верные creds   | POST  | `/api/auth/login` | 200, `token`, `user.username`                          | `auth.api.spec.ts`     |

---

## Visual regression (hash-first, project `visual`)

Двухфазная проверка: perceptual hash (`imghash`) → при расхождении `toHaveScreenshot()` (pixel diff).

| ID  | Сценарий                | Spec             | Эталоны                                 |
| --- | ----------------------- | ---------------- | --------------------------------------- |
| V1  | Login page              | `visual.spec.ts` | `login-page.png`, `login-page.hash`     |
| V2  | Catalog (authenticated) | `visual.spec.ts` | `catalog-page.png`, `catalog-page.hash` |

Платформы: `darwin/` (Mac), `linux/` (CI). Подробнее: [`visual-hash.md`](./visual-hash.md)

```bash
npm run test:visual
npm run test:visual:update   # PNG + .hash
```

---

## Окружения

| Окружение | Web                   | API                   | Запуск тестов                        |
| --------- | --------------------- | --------------------- | ------------------------------------ |
| Local     | http://127.0.0.1:5173 | http://127.0.0.1:3001 | `npm test` (webServer поднимает app) |
| CI        | то же                 | то же                 | GitHub Actions, `CI=true`            |

**Первый запуск локально:** после `npm install` — `npx playwright install chromium`.

---

## Артефакты прогона

- Playwright HTML: `playwright-report/` или CI artifact `playwright-report`
- Allure HTML: `allure-report/` или CI artifact `allure-report`
- Скриншоты падений / visual diff: `test-results/` или CI artifact `test-results`

---

## Traceability

| UI testid (примеры)                       | Сценарии        |
| ----------------------------------------- | --------------- |
| `login-*`                                 | #1, #2, #3, #12 |
| `catalog-*`, `product-*`, `add-to-cart-*` | #4–#7           |
| `cart-*`                                  | #7, #8, #12     |
| `checkout-*`                              | #9, #10         |
| `profile-*`                               | #11             |
| `not-found-page`                          | #12             |
