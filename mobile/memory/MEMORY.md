# cook-us Mobile App - Architecture Notes

## Stack
- React Native (Expo), Expo Router (file-based), TypeScript
- Features in `features/`, pages in `app/`
- No barrel files (index.ts exception: used in feature slices for exports)

## AuthContext (`features/auth/AuthContext.tsx`)
- Stores `token: string | null` AND `user: AuthUser | null`
- Methods: `setToken(token)`, `setAuth(token, user)`, `clearToken()`
- `setAuth` called after login/register to store both token + user data
- `AuthUser` type imported from `features/auth/login/types.ts`

## Vertical Slice Pattern
Inspired by `features/client/cookerBooking/cookerList/`:
- `types.ts` - DTO mirrors + UI types
- `repository.ts` - fetch calls
- `mapper.ts` (optional) - API → UI mapping
- `use{Feature}.ts` - hook with state management
- `components/` - React Native components
- `index.ts` - named exports

## Backend Endpoints (CLIENT role)
Available:
- POST /auth/login → `{ token, user: { id, firstName, lastName, email, role } }`
- POST /auth/register → same
- GET /cooks → list all cooks
- GET /cooks/:id → single cook
- POST /cook-request → create request
- PATCH /cook-request/:id/cancel → cancel request

NOT available (no endpoint):
- GET /users/me (no profile endpoint)
- PATCH /users/me (no profile update)
- POST /auth/change-password
- GET /cook-request?clientId=X (only cook/admin role can GET cook-request/:id)

## Navigation
- `app/client/_layout.tsx` → Stack (with auth guard)
- `app/client/(tabs)/_layout.tsx` → Tabs: home, messages, compte
- Stack screens: viewCook/profile/[cookId], viewCook/booking/[cookId], viewProfile/profile

## Feature Slices Created
- `features/client/cookerBooking/cookerList/` - list of cooks (tab: home)
- `features/client/cookerBooking/cookerProfile/` - cook detail page
- `features/client/cookerBooking/sendProposition/` - booking form
- `features/client/payment/` - payment flow
- `features/client/account/viewProfile/` - user profile (tab: compte)

## Colors
- `colors.main` = #D7553A (primary orange-red)
- `colors.mainDark` = #A82712 (dark red)
- `colors.background` = #FDF6E7 (cream)
- `colors.white` = #FFFFFF
- `colors.text` = #240E0D (dark)
- `colors.tertiary` = #F5C896 (peach)

## UI Components
- `Button` - variants: primary, secondary, outline; loading state
- `Input` - label, hint, error props; focus state
- `TabBarIcon` - wraps Ionicons
