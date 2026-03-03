import { Navigate } from 'react-router-dom'
import { useAuth } from '@src/contexts/auth.context'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FDF6E7]">
                <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
