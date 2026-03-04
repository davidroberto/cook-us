import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useUser } from './useUser'
import { useCookRequests } from '@src/modules/cookRequests/useCookRequests'
import { formatDate } from '@src/utils/format'
import { StatusBadge } from '@src/components/ui/StatusBadge'

const ROLE_LABEL: Record<string, string> = {
    client: 'Client',
    cook: 'Cuisinier',
    admin: 'Administrateur',
}

const SPECIALITY_LABEL: Record<string, string> = {
    french_cooking: 'Française',
    italian_cooking: 'Italienne',
    asian_cooking: 'Asiatique',
    mexican_cooking: 'Mexicaine',
    vegetarian_cooking: 'Végétarienne',
    pastry_cooking: 'Pâtisserie',
    japanese_cooking: 'Japonaise',
    indian_cooking: 'Indienne',
    autre: 'Autre',
}

export const UserDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const userId = Number(id)

    const { data: user, isLoading, isError } = useUser(userId)
    const { data: allRequests } = useCookRequests()

    const linkedRequests = (allRequests ?? []).filter(
        (r) => r.cook.id === userId || r.client.id === userId,
    )

    if (isLoading) {
        return (
            <main className="p-6 md:p-10">
                <p className="text-sm text-muted-foreground">Chargement...</p>
            </main>
        )
    }

    if (isError || !user) {
        return (
            <main className="p-6 md:p-10">
                <p className="text-sm text-destructive">Utilisateur introuvable.</p>
            </main>
        )
    }

    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

    return (
        <main className="p-6 text-foreground md:p-10">
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <button
                    onClick={() => navigate('/users')}
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux utilisateurs
                </button>

                {/* Infos utilisateur */}
                <section className="rounded-lg border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Informations</h2>
                    <div className="flex items-start gap-6">
                        {user.thumbnail ? (
                            <img
                                src={user.thumbnail}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="h-16 w-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                {initials}
                            </div>
                        )}
                        <dl className="grid flex-1 grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">Nom</dt>
                                <dd className="font-medium">{user.firstName} {user.lastName}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Email</dt>
                                <dd>{user.email}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Rôle</dt>
                                <dd className="capitalize">{ROLE_LABEL[user.role] ?? user.role}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">ID</dt>
                                <dd className="font-mono">{user.id}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Créé le</dt>
                                <dd>{formatDate(user.createdAt)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Modifié le</dt>
                                <dd>{formatDate(user.updatedAt)}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                {/* Profil cuisinier */}
                {user.cookProfile && (
                    <section className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Profil cuisinier</h2>
                        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div className="col-span-2">
                                <dt className="mb-1 text-muted-foreground">Description</dt>
                                <dd>{user.cookProfile.description}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Spécialité</dt>
                                <dd>{SPECIALITY_LABEL[user.cookProfile.speciality] ?? user.cookProfile.speciality}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Ville</dt>
                                <dd>{user.cookProfile.city}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Tarif horaire</dt>
                                <dd>{user.cookProfile.hourlyRate}€/h</dd>
                            </div>
                        </dl>
                    </section>
                )}

                {/* Demandes liées */}
                <section className="rounded-lg border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Demandes liées
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({linkedRequests.length})
                        </span>
                    </h2>

                    {linkedRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune demande.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left text-muted-foreground">
                                    <th className="pb-2 pr-4 font-medium">ID</th>
                                    <th className="pb-2 pr-4 font-medium">Rôle</th>
                                    <th className="pb-2 pr-4 font-medium">Autre partie</th>
                                    <th className="pb-2 pr-4 font-medium">Convives</th>
                                    <th className="pb-2 pr-4 font-medium">Début</th>
                                    <th className="pb-2 pr-4 font-medium">Fin</th>
                                    <th className="pb-2 font-medium">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {linkedRequests.map((r) => {
                                    const isCook = r.cook.id === userId
                                    const other = isCook ? r.client : r.cook
                                    return (
                                        <tr key={r.id} className="border-b border-border/50 last:border-0">
                                            <td className="py-2 pr-4 font-mono">{r.id}</td>
                                            <td className="py-2 pr-4">
                                                {isCook ? 'Cuisinier' : 'Client'}
                                            </td>
                                            <td className="py-2 pr-4">
                                                {other.firstName} {other.lastName}
                                            </td>
                                            <td className="py-2 pr-4">{r.guestsNumber}</td>
                                            <td className="py-2 pr-4">{formatDate(r.startDate)}</td>
                                            <td className="py-2 pr-4">{formatDate(r.endDate)}</td>
                                            <td className="py-2"><StatusBadge status={r.status} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </main>
    )
}
