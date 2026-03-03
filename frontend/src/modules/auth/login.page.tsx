import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'
import type { AuthUser } from '@src/types/auth.types'

export const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            apiFetch<{ token: string; user: AuthUser }>('/api/auth/login', null, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),
        onSuccess: ({ user, token }) => {
            login(user, token)
            navigate('/users')
        },
    })

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FDF6E7]">
            <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-primary">Cook&apos;us</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Backoffice — connexion admin</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); mutate({ email, password }) }} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    )
}
