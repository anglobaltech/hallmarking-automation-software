# HallmarkPro

HallmarkPro is a hallmarking centre automation system for reception, quality,
XRF, HUID, reporting, reminders, and admin oversight.

## Project Layout

```text
apps/hallmark_app/     Flutter app for Windows desktop and Android
server/                Node.js API server
database/              PostgreSQL schema and seed direction
infra/                 Local infrastructure such as Docker Compose
docs/                  Product and engineering documentation
```

Full documentation:

```text
docs/APP_DOCUMENTATION.md
```

## First Milestone

- Flutter app shell with role and desk switching
- Node API skeleton with health and workflow endpoints
- PostgreSQL schema for the core business records
- Docker Compose file for local PostgreSQL

## Local Development

Run the Flutter app:

```powershell
cd apps/hallmark_app
flutter run -d windows
```

Run the API after installing dependencies:

```powershell
cd server
npm install
npm run dev
```

Start PostgreSQL with Docker:

```powershell
docker compose -f infra/docker-compose.yml up -d
```
