import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, ChevronsUpDown, Eye } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useUsers, type BackofficeUser } from './useUsers'

type SortKey = 'id' | 'name' | 'email' | 'role' | 'speciality' | 'hourlyRate' | 'city' | 'createdAt' | 'updatedAt'
type SortDirection = 'asc' | 'desc'

const formatDate = (value: string | null) => {
    if (!value) return '-'
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

const getSortValue = (user: BackofficeUser, key: SortKey): string | number => {
    switch (key) {
        case 'id': return user.id
        case 'name': return `${user.lastName} ${user.firstName}`.toLowerCase()
        case 'email': return user.email.toLowerCase()
        case 'role': return user.role
        case 'speciality': return user.cookProfile?.speciality ?? '\uffff'
        case 'hourlyRate': return parseFloat(user.cookProfile?.hourlyRate ?? '99999')
        case 'city': return user.cookProfile?.city.toLowerCase() ?? '\uffff'
        case 'createdAt': return new Date(user.createdAt).getTime()
        case 'updatedAt': return new Date(user.updatedAt).getTime()
    }
}

const sortUsers = (data: BackofficeUser[], key: SortKey, direction: SortDirection) => {
    return [...data].sort((a, b) => {
        const valA = getSortValue(a, key)
        const valB = getSortValue(b, key)
        if (valA < valB) return direction === 'asc' ? -1 : 1
        if (valA > valB) return direction === 'asc' ? 1 : -1
        return 0
    })
}

const SortIcon = ({ column, sortKey, direction }: { column: SortKey; sortKey: SortKey | null; direction: SortDirection | null }) => {
    if (sortKey !== column) return <ChevronsUpDown className="ml-1 inline h-3 w-3 opacity-40" />
    if (direction === 'asc') return <ChevronUp className="ml-1 inline h-3 w-3" />
    return <ChevronDown className="ml-1 inline h-3 w-3" />
}

const DescriptionCell = ({ text }: { text: string | null }) => {
    if (!text) return <span className="text-muted-foreground">-</span>
    return (
        <div className="group relative">
            <span className="block max-w-[180px] cursor-default truncate">{text}</span>
            <div className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden w-72 rounded-md border border-border bg-card px-3 py-2 text-xs shadow-lg group-hover:block">
                {text}
            </div>
        </div>
    )
}

export const UsersTablePage = () => {
    const [sortKey, setSortKey] = useState<SortKey | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection | null>(null)
    const navigate = useNavigate()

    const { data, isLoading, isError } = useUsers()

    const handleSort = (key: SortKey) => {
        if (sortKey !== key) {
            setSortKey(key)
            setSortDirection('asc')
        } else if (sortDirection === 'asc') {
            setSortDirection('desc')
        } else {
            setSortKey(null)
            setSortDirection(null)
        }
    }

    const activeUsers = (data ?? []).filter((user) => user.deletedAt === null)
    const sortedUsers = sortKey && sortDirection ? sortUsers(activeUsers, sortKey, sortDirection) : activeUsers

    const thClass = 'cursor-pointer select-none hover:text-foreground'

    return (
        <main className="p-6 text-foreground md:p-10">
            <section className="mx-auto w-full max-w-7xl space-y-4">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground">Backoffice - gestion des utilisateurs Cook&apos;us</p>
                </header>

                <div className="rounded-lg border bg-card p-4">
                    {isError && (
                        <p className="py-8 text-center text-sm text-destructive">
                            Impossible de charger les utilisateurs.
                        </p>
                    )}

                    {isLoading && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Chargement...
                        </p>
                    )}

                    {!isLoading && !isError && (
                        <Table>
                            <TableCaption>Liste des utilisateurs ({activeUsers.length})</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={thClass} onClick={() => handleSort('id')}>
                                        ID <SortIcon column="id" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('name')}>
                                        Nom <SortIcon column="name" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('email')}>
                                        Email <SortIcon column="email" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('role')}>
                                        Rôle <SortIcon column="role" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('speciality')}>
                                        Spécialité <SortIcon column="speciality" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('city')}>
                                        Ville <SortIcon column="city" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('hourlyRate')}>
                                        Tarif/h <SortIcon column="hourlyRate" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('createdAt')}>
                                        Créé le <SortIcon column="createdAt" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('updatedAt')}>
                                        Modifié le <SortIcon column="updatedAt" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.id}</TableCell>
                                        <TableCell>
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell><DescriptionCell text={user.cookProfile?.description ?? null} /></TableCell>
                                        <TableCell className="capitalize">{user.cookProfile?.speciality ?? '-'}</TableCell>
                                        <TableCell>{user.cookProfile?.city ?? '-'}</TableCell>
                                        <TableCell>{user.cookProfile?.hourlyRate ? `${user.cookProfile.hourlyRate}€/h` : '-'}</TableCell>
                                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                                        <TableCell>{formatDate(user.updatedAt)}</TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => navigate(`/users/${user.id}`)}
                                                className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                                title="Voir le détail"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </section>
        </main>
    )
}
