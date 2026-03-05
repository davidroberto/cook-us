import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { usePendingCooks, usePendingCookAction, type PendingCook } from './usePendingCooks'
import { formatDate } from '@src/utils/format'

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

const PendingCookRow = ({ cook }: { cook: PendingCook }) => {
    const navigate = useNavigate()
    const action = usePendingCookAction(cook.id)

    return (
        <TableRow>
            <TableCell className="font-medium">
                {cook.firstName} {cook.lastName}
            </TableCell>
            <TableCell>{cook.email}</TableCell>
            <TableCell className="font-mono text-xs">
                {cook.cookProfile.siret ?? <span className="italic text-muted-foreground">Non renseigné</span>}
            </TableCell>
            <TableCell>{SPECIALITY_LABEL[cook.cookProfile.speciality] ?? cook.cookProfile.speciality}</TableCell>
            <TableCell>{formatDate(cook.createdAt)}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => action.mutate({ approve: true })}
                        disabled={action.isPending}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Approuver
                    </button>
                    <button
                        onClick={() => action.mutate({ approve: false })}
                        disabled={action.isPending}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Refuser
                    </button>
                    {action.isError && (
                        <span className="text-xs text-red-600">
                            {(action.error as Error).message}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <button
                    onClick={() => navigate(`/users/${cook.id}`)}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    title="Voir le détail"
                >
                    <Eye className="h-4 w-4" />
                </button>
            </TableCell>
        </TableRow>
    )
}

export const PendingCooksPage = () => {
    const { data, isLoading, isError } = usePendingCooks()

    return (
        <main className="p-6 text-foreground md:p-10">
            <section className="mx-auto w-full max-w-7xl space-y-4">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Validations cuisiniers</h1>
                    <p className="text-sm text-muted-foreground">Cuisiniers en attente de validation</p>
                </header>

                <div className="rounded-lg border bg-card p-4">
                    {isError && (
                        <p className="py-8 text-center text-sm text-destructive">
                            Impossible de charger les cuisiniers en attente.
                        </p>
                    )}

                    {isLoading && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Chargement...
                        </p>
                    )}

                    {!isLoading && !isError && (data ?? []).length === 0 && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Aucun cuisinier en attente de validation.
                        </p>
                    )}

                    {!isLoading && !isError && (data ?? []).length > 0 && (
                        <Table>
                            <TableCaption>Cuisiniers en attente ({data!.length})</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>SIRET</TableHead>
                                    <TableHead>Spécialité</TableHead>
                                    <TableHead>Inscrit le</TableHead>
                                    <TableHead>Actions</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data!.map((cook) => (
                                    <PendingCookRow key={cook.id} cook={cook} />
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </section>
        </main>
    )
}
