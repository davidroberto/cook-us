import { useState } from 'react'
import type { AuthUser } from '@src/types/auth.types'
import { AuthContext } from '@src/contexts/useAuth'

const STORAGE_KEY = 'cookus_auth'
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000 // 4h

type StoredSession = {
    user: AuthUser
    token: string
    expiresAt: number
}

const loadSession = (): { user: AuthUser; token: string } | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const session: StoredSession = JSON.parse(raw)
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem(STORAGE_KEY)
            return null
        }
        return { user: session.user, token: session.token }
    } catch {
        return null
    }
}

const saveSession = (user: AuthUser, token: string) => {
    const session: StoredSession = { user, token, expiresAt: Date.now() + SESSION_DURATION_MS }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const clearSession = () => localStorage.removeItem(STORAGE_KEY)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const stored = loadSession()
    const [user, setUser] = useState<AuthUser | null>(stored?.user ?? null)
    const [token, setToken] = useState<string | null>(stored?.token ?? null)

    const login = (user: AuthUser, token: string) => {
        saveSession(user, token)
        setUser(user)
        setToken(token)
    }

    const logout = () => {
        clearSession()
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading: false, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
