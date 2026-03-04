import { createContext, useContext } from 'react'
import type { AuthUser } from '@src/types/auth.types'

export type AuthContextValue = {
    user: AuthUser | null
    token: string | null
    isLoading: boolean
    login: (user: AuthUser, token: string, refreshToken: string) => void
    logout: () => void
    apiFetch: <T>(url: string, options?: RequestInit) => Promise<T>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
