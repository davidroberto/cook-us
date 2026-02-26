# cook'us

## Stack
- **Backend:** NestJS 9, TypeORM, PostgreSQL 16
- **Frontend:** React 19, Vite 7, TypeScript
- **Mobile:** React Native (Expo)
- **E2E:** Playwright
- **Infra:** Docker Compose, Nginx reverse proxy

## Architecture
- Clean Architecture simplifiée : Controller → UseCase
- Modules organisés par feature dans `src/modules/`
- Naming convention : `{feature}.{type}.ts` (ex: `getAppName.controller.ts`)
- Path alias : `@src/*` → `./src/*` (backend et frontend)

## Commands

### Development
```bash
docker compose --env-file .env.local -f docker-compose.dev.yml up --build
```

### Backend
```bash
cd backend
npm run start:dev    # Dev server (watch)
npm run build        # Build
npm run lint         # Lint
```

### Frontend
```bash
cd frontend
npm run dev          # Vite dev server
npm run build        # TypeCheck + Build
npm run lint         # Lint
```

### Mobile
```bash
cd mobile
npx expo start       # Start Expo dev server
```

### E2E
```bash
cd e2e
npm run test:e2e     # Run Playwright tests
```

## Conventions
- Pas de barrel files (index.ts)
- Commit format : `{type}: {scope}: {description}`
- Co-Author: `Claude Opus 4.6 <noreply@anthropic.com>`
