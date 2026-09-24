# backend-nest

NestJS + TypeORM API for the [`AppServices`](../AppServices) mobile app. Started as a like-for-like port of the plain-Express [`backend`](../backend) project (same PostgreSQL database `ALT_ServiceApp`, same JWT scheme) and has since grown past it with new modules (weather, places, categories, menu). Both servers can run side by side against the same database — `backend/` on port `5000`, this one on `5001` — for direct comparison.

## Tech stack

- NestJS 11, TypeORM 1.x (Postgres via `@nestjs/typeorm` + `pg`)
- Passport JWT strategy (`@nestjs/passport`, `passport-jwt`)
- `class-validator` / `class-transformer` for DTO validation and response shaping
- Multer (`FileInterceptor`) for uploads, served statically from `public/`
- Axios (`@nestjs/axios`) for outbound calls (weather, places)

## Project structure

```
src/
  auth/                 JWT strategy, guard, login/session controller
  users/                 /user
  roles/                 /role
  configuration/         /configuration (all routes JWT-protected)
  professional-profile/  /professionalprofile
  user-profile/          /userprofile
  upload/                 /upload (Multer, writes to public/)
  category/               /category
  subcategory/            /subcategory
  menu/                   /menu
  places/                 /places/search — Google Places Text Search proxy
  weather/                /weather/:latitude/:longitude — OpenWeather proxy
  entities/               TypeORM entities, mirroring the original Sequelize schema
  database/
    data-source.ts        TypeORM CLI + app share this connection/entity config
    migrations/            Schema migrations
  app.module.ts
  main.ts                 Global prefix "api", ValidationPipe, ClassSerializerInterceptor
```

## Getting started

```bash
npm install
cp .env.example .env   # fill in DB_PASSWORD, TOKEN_KEY, GOOGLE_MAPS_API_KEY (see backend/.env for matching values)
npm run start:dev      # http://localhost:5001/api
```

`DB_SYNCHRONIZE` must stay `false` against the real database — the schema already exists (created by the original Sequelize migrations, now tracked going forward via `src/database/migrations`). It only exists so this project can point at a disposable database for testing without hand-written migrations.

## Environment (`.env`)

| Var                     | Purpose                                                                 |
| ----------------------- | ------------------------------------------------------------------------ |
| `DB_HOST/PORT/USERNAME/PASSWORD/DATABASE` | Postgres connection — kept identical to `backend/.env`          |
| `TOKEN_KEY`             | JWT signing key — identical to `backend/.env` so tokens validate against either server |
| `PORT`                  | Defaults to `5001` (vs. `backend/`'s `5000`) so both can run at once     |
| `DB_SYNCHRONIZE`        | Only `true` against a disposable/test database — never against `ALT_ServiceApp` |
| `OPEN_WEATHER_API_KEY`  | OpenWeather API key, used by `/api/weather/:lat/:lng`                   |
| `GOOGLE_MAPS_API_KEY`   | Same key `AppServices` uses client-side; reused server-side for `/api/places/search` (Places Text Search). If it's HTTP-referrer restricted in Google Cloud Console, server-side calls fail with `REQUEST_DENIED` — use a separate, unrestricted or IP-restricted key here. |

## API surface

All routes are mounted under `/api`. Routes marked 🔒 require `Authorization: <token>` (no `Bearer` prefix, matching the original `backend/` and the `AppServices` frontend).

| Resource | Routes |
| --- | --- |
| Auth | `POST /auth` (login) · `PUT /auth/:sessionId` 🔒 |
| Users | `GET /user` 🔒 · `GET /user/byusername/:username` · `GET /user/:userId` 🔒 · `POST /user` · `PUT /user/:userId` 🔒 · `DELETE /user/:userId` 🔒 |
| Roles | `GET /role` · `GET /role/:roleId` 🔒 · `POST /role` 🔒 · `PUT /role/:roleId` 🔒 · `DELETE /role/:roleId` 🔒 |
| Configuration | `GET/POST/PUT/DELETE /configuration` — entire controller is 🔒 |
| Professional profiles | `GET /professionalprofile` 🔒 · `GET/:profileId` 🔒 · `POST` · `PUT/:profileId` 🔒 · `DELETE/:profileId` 🔒 |
| User profiles | Same shape as above, under `/userprofile` |
| Categories | `GET /category` · `GET/:categoryId` 🔒 · `POST` 🔒 · `PUT/:categoryId` 🔒 · `DELETE/:categoryId` 🔒 |
| Subcategories | Same shape, under `/subcategory` |
| Menu | Same shape, under `/menu` |
| Places | `GET /places/search?q=&lat=&lng=` |
| Weather | `GET /weather/:latitude/:longitude` |
| Upload | `POST /upload` (multipart) |

## What changed vs. `backend/`

- **ORM**: Sequelize → TypeORM. Entities in `src/entities/` map to the exact same tables/columns (including the `UserRoles` join table Sequelize auto-created), so no schema migration was needed to switch over.
- **Auth**: `middleware/token.js` → Nest's Passport JWT strategy (`src/auth/jwt.strategy.ts`), applied per-route with `@UseGuards(JwtAuthGuard)` matching each original route's protection exactly. The strategy still reads the raw token from the `Authorization` header with no `Bearer` prefix.
- **Uploads**: `express-fileupload` → Nest's built-in Multer integration (`FileInterceptor`), still writing to `public/` and serving it at the same paths.
- **New capabilities not present in `backend/`**: categories/subcategories/menu CRUD, a weather proxy, and a Google Places search proxy.

## Bugs fixed during the port

- **Login now works.** The original looked users up by `username` while the frontend sends `email` — nothing could ever log in. `AuthService.login` now queries by `email`.
- **Two crash-the-whole-process bugs are gone.** Both were unhandled promise rejections (`getUserLogin` on a malformed body, `SessionController.addSession`'s catch block calling `res.status()` on an undefined `res`). Nest's exception handling turns async controller/service errors into a proper HTTP error response instead of taking the process down.
- **`/api/configuration`'s POST/PUT/DELETE now actually work.** The original routes called `addConfiguration`/`updateConfiguration`/`deleteRole`, but the controller exported `addConfig`/`updateConfig`/`deleteRole` — those endpoints were calling `undefined` and would have thrown immediately.
- **Malformed IDs in the URL return a clean 400** instead of a raw Postgres error (`ParseUUIDPipe` on every `:xId` route param).

## Deliberately not ported

- **`controller/email.js`** from `backend/` — historically had a real credential hardcoded in plaintext, isn't wired into `index.js`, and `nodemailer` isn't even a declared dependency there. Rotate that credential regardless of what happens with this port.
- **The password hash is no longer embedded in the JWT or returned by `GET /user`.** The original signed the entire Sequelize user row (including the bcrypt hash) into the token and returned it on every user fetch. `User.password` is now `@Exclude()`d from all responses, and the JWT payload strips it explicitly before signing.
