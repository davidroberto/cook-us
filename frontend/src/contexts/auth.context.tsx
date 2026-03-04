import { useState, useRef, useCallback } from 'react'
import type { AuthUser } from '@src/types/auth.types'
import { AuthContext } from '@src/contexts/useAuth'

const STORAGE_KEY = 'cookus_auth'

type StoredSession = {
    user: AuthUser
    token: string
    refreshToken: string
}

const loadSession = (): StoredSession | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as StoredSession
    } catch {
        return null
    }
}

const saveSession = (user: AuthUser, token: string, refreshToken: string) => {
    const session: StoredSession = { user, token, refreshToken }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const clearSession = () => localStorage.removeItem(STORAGE_KEY)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const stored = loadSession()
    const [user, setUser] = useState<AuthUser | null>(stored?.user ?? null)
    const [token, setToken] = useState<string | null>(stored?.token ?? null)
    const refreshTokenRef = useRef<string | null>(stored?.refreshToken ?? null)
    const refreshPromiseRef = useRef<Promise<string | null> | null>(null)

    const logout = useCallback(() => {
        clearSession()
        refreshTokenRef.current = null
        setUser(null)
        setToken(null)
    }, [])

    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        const rt = refreshTokenRef.current
        if (!rt) return null

        try {
            const res = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: rt }),
            })

            if (!res.ok) return null

            const data = (await res.json()) as { token: string; refreshToken: string }

            setToken(data.token)
            refreshTokenRef.current = data.refreshToken

            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                const session = JSON.parse(raw) as StoredSession
                session.token = data.token
                session.refreshToken = data.refreshToken
                localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
            }

            return data.token
        } catch {
            return null
        }
    }, [])

    const getValidToken = useCallback(async (): Promise<string | null> => {
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current
        }

        refreshPromiseRef.current = refreshAccessToken()
        const newToken = await refreshPromiseRef.current
        refreshPromiseRef.current = null

        if (!newToken) {
            logout()
            return null
        }

        return newToken
    }, [refreshAccessToken, logout])

    const apiFetch = useCallback(
        async <T,>(url: string, options?: RequestInit): Promise<T> => {
            const doFetch = async (t: string) => {
                const res = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${t}`,
                        ...options?.headers,
                    },
                })
                return res
            }

            let currentToken = token
            if (!currentToken) throw new Error('Non authentifié')

            let res = await doFetch(currentToken)

            if (res.status === 401) {
                const newToken = await getValidToken()
                if (!newToken) throw new Error('Session expirée')
                currentToken = newToken
                res = await doFetch(currentToken)
            }

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error((err as { message?: string }).message ?? 'Erreur réseau')
            }

            return res.json() as Promise<T>
        },
        [token, getValidToken],
    )

    const login = (user: AuthUser, token: string, refreshToken: string) => {
        saveSession(user, token, refreshToken)
        refreshTokenRef.current = refreshToken
        setUser(user)
        setToken(token)
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading: false, login, logout, apiFetch }}>
            {children}
        </AuthContext.Provider>
    )
}
