# Cook'US

Marketplace mettant en relation des clients avec des cuisiniers particuliers pour des repas à domicile personnalisés.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | NestJS 11, TypeORM, PostgreSQL 16 |
| Backoffice | React 19, Vite 7, TailwindCSS, shadcn/ui |
| Mobile | React Native, Expo 54 |
| Reverse proxy | Nginx |
| Infra | Docker Compose |

---

## Prérequis

- Node.js 20+
- Docker & Docker Compose
- Expo Go (sur téléphone) ou simulateur iOS/Android

---

## Installation & lancement

### 1. Configurer l'environnement

```bash
cp .env .env.local
# Modifier les variables dans .env.local si nécessaire
```

### 2. Configurer Git

```bash
git config pull.rebase true
```

> Configure `git pull` pour utiliser le rebase par défaut (au lieu de merge), afin de garder un historique linéaire et propre. Après cette configuration, un simple `git pull` suffira.

### 3. Lancer l'application (backend + backoffice + base de données)

```bash
docker compose --env-file .env.local -f docker-compose.dev.yml up --build
```

- Backoffice : `http://localhost`
- API : `http://localhost/api`

### 4. Lancer le mobile

```bash
cd mobile
npx expo start
```

Scanner le QR code avec Expo Go, ou appuyer sur `i` (iOS) / `a` (Android).

---

## Commandes utiles

### Backend

```bash
cd backend
npm run start:dev   # Serveur de développement (watch)
npm run build       # Build + typecheck
npm run lint        # Lint
npm run seed        # Peupler la base de données avec des données de test
```

### Backoffice

```bash
cd frontend
npm run dev         # Serveur Vite
npm run build       # Typecheck + build
npm run lint        # Lint
```

### Mobile

```bash
cd mobile
npx expo start      # Serveur Expo
```

### E2E

```bash
cd e2e
npm run test:e2e    # Tests Playwright
```

---

## Structure du repo

```
cook-us/
├── backend/     # API NestJS (Clean Architecture : Controller → UseCase)
├── frontend/    # Backoffice React/Vite
├── mobile/      # App React Native / Expo
├── e2e/         # Tests end-to-end Playwright
├── nginx/       # Configuration du reverse proxy
└── docker-compose.dev.yml
```

---

## Comptes de test

> Créés automatiquement par `npm run seed` (dans `backend/`)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@cookus.app | admin1234 |
| Cuisinier | cook1@cookus.app | cook1234 |
| Client | client1@cookus.app | client1234 |

---

## 🧱 CI

### Pre-push hook (Husky)

Un hook git `pre-push` vérifie le code avant chaque `git push`. Il exécute dans l'ordre :

1. **Backend** : lint → build (typecheck)
2. **Frontend** : lint → build (typecheck)

Le hook s'installe automatiquement via `npm install` à la racine du projet (script `prepare` de Husky).

### GitHub Actions CI

Un workflow CI (`.github/workflows/ci.yml`) se déclenche à chaque push sur `main`. Il comprend 3 jobs :

| Job | Contenu | Dépendance |
|-----|---------|------------|
| `backend-checks` | lint, build | — |
| `frontend-checks` | lint, build | — |
| `build-images` | build des images Docker (docker-compose.prod.yml) | backend-checks + frontend-checks |

Les jobs `backend-checks` et `frontend-checks` tournent en parallèle. Le job `build-images` ne se lance que si les deux premiers réussissent.

**Trunk-Based Development** : la CI ne bloque pas le push. Si main est rouge, priorité absolue = réparer.

---

## 🚀 CD

### GitHub Actions CD

Un workflow CD (`.github/workflows/cd.yml`) se déclenche au push d'un tag `v*.*.*`. Il comprend 5 jobs :

| Job | Contenu | Dépendance |
|-----|---------|------------|
| `backend-checks` | lint, build | — |
| `frontend-checks` | lint, build | — |
| `e2e-checks` | Playwright (build Docker + tests navigateur) | — |
| `build-and-push` | Build et push images Docker vers GHCR | backend + frontend + e2e checks |
| `deploy` | Copie des fichiers + pull/restart sur le serveur via SSH | build-and-push |

### Créer un release

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Images Docker

Les images sont publiées sur GitHub Container Registry :
- `ghcr.io/{owner}/cook-us/frontend`
- `ghcr.io/{owner}/cook-us/backend`

### Secrets GitHub nécessaires

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Adresse IP ou hostname du serveur |
| `SSH_USER` | Utilisateur SSH |
| `SSH_PASSWORD` | Mot de passe SSH |
| `SSH_PORT` | Port SSH |
