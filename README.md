# backend-nest

NestJS port of the `backend/` Express project. Same routes, same Postgres database (`ALT_ServiceApp`), same JWT scheme — meant to be a drop-in replacement for `backend/` once you're satisfied with it. Both can run side by side (`backend/` on port 5000, this on 5001) so you can compare them directly.

## Running

```bash
npm install
cp .env.example .env   # fill in DB_PASSWORD and TOKEN_KEY (see backend/.env for the current values)
npm run start:dev
```

`DB_SYNCHRONIZE` must stay `false` against the real database — the schema already exists (created by the original Sequelize migrations). It only exists so this project can be pointed at a disposable database for testing without needing hand-written migrations.

## What changed vs. `backend/`

- **ORM**: Sequelize → TypeORM. Entities in `src/entities/` map to the exact same tables/columns (including the `UserRoles` join table Sequelize auto-created), so no schema migration is needed to switch over.
- **Auth**: `middleware/token.js` → Nest's Passport JWT strategy (`src/auth/jwt.strategy.ts`), applied per-route with `@UseGuards(JwtAuthGuard)` matching each original route's protection exactly. The strategy still reads the raw token from the `Authorization` header with no `Bearer` prefix, matching the original and the AppServices frontend.
- **Uploads**: `express-fileupload` → Nest's built-in Multer integration (`FileInterceptor`), still writing to `public/` and serving it at the same paths.

## Bugs fixed during the port (per your request)

- **Login now works.** The original looked users up by `username` while the frontend sends `email` — nothing could ever log in. `AuthService.login` now queries by `email`.
- **Two crash-the-whole-process bugs are gone.** Both were unhandled promise rejections (`getUserLogin` on a malformed body, `SessionController.addSession`'s catch block calling `res.status()` on an undefined `res`). Nest's exception handling means async controller/service errors turn into a proper HTTP error response instead of taking the process down.
- **`/api/configuration`'s POST/PUT/DELETE now actually work.** The original routes called `addConfiguration`/`updateConfiguration`/`deleteConfiguration`, but the controller exported `addConfig`/`updateConfig`/`deleteRole` — those endpoints were calling `undefined` and would have thrown immediately.
- **Malformed IDs in the URL return a clean 400** instead of a raw Postgres error (`ParseUUIDPipe` on every `:xId` route param).

## Deliberately not ported

- **`controller/email.js`** — has a real Gmail password hardcoded in plaintext, isn't wired into `index.js`, and `nodemailer` isn't even a declared dependency. Rotate that credential regardless of what happens with this port.
- **The password hash is no longer embedded in the JWT or returned by `GET /user`.** The original signed the entire Sequelize user row (including the bcrypt hash) into the token and returned it on every user fetch. `User.password` is now `@Exclude()`d from all responses, and the JWT payload strips it explicitly before signing.
