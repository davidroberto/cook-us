import { useState } from 'react'
import type { AuthUser } from '@src/types/auth.types'
import { AuthContext } from '@src/contexts/useAuth'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const login = (user: AuthUser, token: string) => {
        setUser(user)
        setToken(token)
    }
    const logout = () => {
        setUser(null)
        setToken(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoading: false, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
