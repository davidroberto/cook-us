import { useEffect, useState } from 'react'
import type { AuthUser } from '@src/types/auth.types'
import { mockMe } from '@src/modules/auth/auth.mock'
import { AuthContext } from '@src/contexts/useAuth'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // TODO: replace with real fetch GET /api/auth/me
        mockMe()
            .then(setUser)
            .finally(() => setIsLoading(false))
    }, [])

    const login = (user: AuthUser) => setUser(user)
    const logout = () => {
        // TODO: call POST /api/auth/logout to clear the httpOnly cookie
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
