## 🧱 BUILD

### Installation et configuration

Pour installer les dépendances en local (pour complétion du code)
- Dans le dossier frontend : `npm install`
- Dans le dossier backend : `npm install`
- Dans le dossier mobile : `npm install`
- Dans le dossier e2e : `npm install`

- Copiez le fichier `.env` en `.env.local` et modifiez les variables d'environnement

---

## ▶️ RUN

Dev :
- `docker compose --env-file .env.local -f docker-compose.dev.yml up` pour lancer l'application en dev
- Le frontend est accessible sur `http://localhost`
- Le backend est accessible sur `http://localhost/api/home/app-name` avec le endpoint en GET par défaut (`{"name":"cook'us"}`)

Mobile :
- `cd mobile && npx expo start` pour lancer le serveur Expo
- Scanner le QR code avec Expo Go sur le téléphone, ou `i` pour iOS / `a` pour Android

---

## 🛡️ CI

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
