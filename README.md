# shortUrl — URL Shortener Monorepo

A full-stack URL shortener built as a **Turborepo monorepo**, with a Next.js frontend, an Express.js backend, and a shared PostgreSQL database layer via Prisma.

---

## Features

- 🔗 Shorten any long URL to a 6-character nanoid slug
- ♻️ Deduplication — the same long URL always returns the same short link
- 🔀 Automatic redirect when visiting a short URL
- 🗃️ PostgreSQL persistence via Prisma ORM
- 🧱 Shared packages for DB client, validation schemas, and UI components
- ⚡ Turborepo for fast, cached parallel builds

---

## Monorepo Structure

```
shortUrl_Monorepo/
├── apps/
│   ├── web/          # Next.js 16 frontend (React 19, Tailwind CSS v4)
│   └── http/         # Express.js backend API
└── packages/
    ├── db/           # Prisma client + PostgreSQL schema (@repo/db)
    ├── common/       # Shared Zod validation schemas (@repo/common)
    ├── ui/           # Shared React component library (@repo/ui)
    ├── eslint-config/       # Shared ESLint config (@repo/eslint-config)
    └── typescript-config/   # Shared tsconfig bases (@repo/typescript-config)
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 16, React 19, Tailwind CSS v4, Axios |
| Backend    | Express.js 5, nanoid, CORS, dotenv  |
| Database   | PostgreSQL, Prisma ORM (pg adapter) |
| Validation | Zod                                 |
| Monorepo   | Turborepo, pnpm workspaces          |
| Language   | TypeScript (throughout)             |

---

## Prerequisites

- **Node.js** >= 18
- **pnpm** 9.x — `npm install -g pnpm@9`
- A running **PostgreSQL** instance

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/adieesingh/shortUrl_Monorepo.git
cd shortUrl_Monorepo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file at the **root** of the monorepo:

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/shorturl

# Base URL of the backend (used to construct short URLs)
BACKEND_URL=http://localhost:3002/

# Exposed to the Next.js frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

### 4. Set up the database

```bash
# Run Prisma migrations
cd packages/db
npx prisma migrate deploy

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 5. Build shared packages

```bash
# From the repo root
pnpm run build --filter=@repo/db --filter=@repo/common
```

### 6. Start development servers

```bash
# Runs both apps in parallel via Turborepo
pnpm dev
```

| App     | URL                    |
|---------|------------------------|
| Web UI  | http://localhost:3000  |
| API     | http://localhost:3002  |

---

## API Reference

### `POST /url`

Shorten a long URL.

**Request body:**
```json
{ "longUrl": "https://example.com/some/very/long/path" }
```

**Response (200 — new URL created):**
```json
{ "shortUrl": "http://localhost:3002/abc123", "message": "Done" }
```

**Response (211 — URL already exists):**
```json
{ "shortUrl": "http://localhost:3002/abc123", "message": "Done" }
```

---

### `GET /:shortUrl`

Redirects to the original long URL.

- **302 Redirect** — on success
- **411** — if the short URL is not found in the database

---

## Database Schema

```prisma
model Url {
  id        String   @id @default(uuid())
  longUrl   String
  shortUrl  String   @unique
  createAt  DateTime @default(now())
  updatedAt DateTime @default(now())
}
```

---

## Available Scripts

Run from the **repo root** using `pnpm`:

| Command           | Description                              |
|-------------------|------------------------------------------|
| `pnpm dev`        | Start all apps in development mode       |
| `pnpm build`      | Build all apps and packages              |
| `pnpm lint`       | Lint all packages                        |
| `pnpm check-types`| Type-check all packages                  |
| `pnpm format`     | Format all `.ts`, `.tsx`, `.md` files with Prettier |

Run a single app or package using Turborepo filters:

```bash
pnpm dev --filter=web
pnpm dev --filter=http
pnpm build --filter=@repo/db
```

---

## How It Works

1. The user pastes a long URL into the **Next.js** frontend and clicks **Generate Short URL**.
2. The frontend sends a `POST /url` request to the **Express** backend.
3. The backend validates the payload with **Zod**, checks if the URL already exists in **PostgreSQL**, and either returns the existing short code or generates a new 6-character **nanoid** slug.
4. The short URL (e.g. `http://localhost:3002/xK9pQr`) is returned to the frontend and displayed.
5. Visiting the short URL triggers a `GET /:shortUrl` request; the backend looks up the slug in the DB and issues a **redirect** to the original URL.

---

## Project Decisions

- **Deduplication:** If the same long URL is submitted twice, the existing short URL is returned rather than generating a duplicate slug.
- **nanoid(6):** Generates a URL-safe, 6-character random slug (~68 billion possible combinations).
- **Shared `@repo/db` package:** The Prisma client is instantiated once and exported from the `packages/db` workspace, keeping the backend thin and making it easy to add more apps that share the same DB client.
- **Shared `@repo/common`:** The Zod schema for URL validation lives here so it could be reused across multiple backends or even on the frontend if needed.
