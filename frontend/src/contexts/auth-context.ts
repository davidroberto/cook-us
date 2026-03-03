import { createContext } from 'react'
import type { AuthUser } from '@src/types/auth.types'

export type AuthContextValue = {
    user: AuthUser | null
    isLoading: boolean
    login: (user: AuthUser) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
