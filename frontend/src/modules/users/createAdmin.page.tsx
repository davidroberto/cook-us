import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCreateAdmin } from './useCreateAdmin'

export const CreateAdminPage = () => {
    const navigate = useNavigate()
    const createAdmin = useCreateAdmin()

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createAdmin.mutate(form, {
            onSuccess: () => {
                navigate('/users')
            },
        })
    }

    return (
        <main className="p-6 text-foreground md:p-10">
            <div className="mx-auto w-full max-w-lg space-y-6">
                <button
                    onClick={() => navigate('/users')}
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux utilisateurs
                </button>

                <section className="rounded-lg border border-border bg-card p-6">
                    <h2 className="mb-6 text-lg font-semibold">Créer un administrateur</h2>

                    {createAdmin.isSuccess && (
                        <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
                            Administrateur créé avec succès.
                        </div>
                    )}

                    {createAdmin.isError && (
                        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
                            {(createAdmin.error as Error).message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm text-muted-foreground">Prénom</label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-muted-foreground">Nom</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-muted-foreground">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-muted-foreground">Mot de passe</label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={createAdmin.isPending}
                            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createAdmin.isPending ? 'Création...' : 'Créer l\'administrateur'}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    )
}
