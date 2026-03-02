import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

type UserRole = 'client' | 'cook' | 'admin'
type CookSpeciality = 'indian' | 'french' | 'italien'

type BackofficeUser = {
    id: number
    firstName: string
    lastName: string
    email: string
    thumbnail: string | null
    role: UserRole
    createdAt: string
    deletedAt: string | null
    cookProfile: {
        speciality: CookSpeciality
        city: string
        price: string
    } | null
}

type SortKey = 'id' | 'name' | 'email' | 'role' | 'speciality' | 'city' | 'price' | 'createdAt' | 'deletedAt'
type SortDirection = 'asc' | 'desc'

const users: BackofficeUser[] = [
    {
        id: 1,
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@cookus.app',
        thumbnail: null,
        role: 'client',
        createdAt: '2026-01-12T10:00:00Z',
        deletedAt: null,
        cookProfile: null,
    },
    {
        id: 2,
        firstName: 'Luca',
        lastName: 'Bianchi',
        email: 'luca.bianchi@cookus.app',
        thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
        role: 'cook',
        createdAt: '2026-01-20T15:45:00Z',
        deletedAt: null,
        cookProfile: {
            speciality: 'italien',
            city: 'Lyon',
            price: '45€',
        },
    },
    {
        id: 3,
        firstName: 'Aïcha',
        lastName: 'Martin',
        email: 'aicha.martin@cookus.app',
        thumbnail: null,
        role: 'cook',
        createdAt: '2026-02-01T09:20:00Z',
        deletedAt: null,
        cookProfile: {
            speciality: 'indian',
            city: 'Paris',
            price: '52€',
        },
    },
    {
        id: 4,
        firstName: 'Admin',
        lastName: 'Cookus',
        email: 'admin@cookus.app',
        thumbnail: null,
        role: 'admin',
        createdAt: '2025-12-15T08:00:00Z',
        deletedAt: null,
        cookProfile: null,
    },
    {
        id: 5,
        firstName: 'Nora',
        lastName: 'Petit',
        email: 'nora.petit@cookus.app',
        thumbnail: null,
        role: 'client',
        createdAt: '2026-02-14T13:30:00Z',
        deletedAt: '2026-02-28T18:10:00Z',
        cookProfile: null,
    },
]

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
        case 'city': return user.cookProfile?.city.toLowerCase() ?? '\uffff'
        case 'price': return parseInt(user.cookProfile?.price ?? '99999')
        case 'createdAt': return new Date(user.createdAt).getTime()
        case 'deletedAt': return user.deletedAt ? new Date(user.deletedAt).getTime() : Infinity
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

export const UsersTablePage = () => {
    const [sortKey, setSortKey] = useState<SortKey | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection | null>(null)

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

    const activeUsers = users.filter((user) => user.deletedAt === null)
    const sortedUsers = sortKey && sortDirection ? sortUsers(activeUsers, sortKey, sortDirection) : activeUsers

    const thClass = 'cursor-pointer select-none hover:text-foreground'

    return (
        <main className="min-h-screen bg-[#FDF6E7] p-6 text-foreground md:p-10">
            <section className="mx-auto w-full max-w-7xl space-y-4">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground">Backoffice - gestion des utilisateurs Cook&apos;us</p>
                </header>

                <div className="rounded-lg border bg-card p-4">
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
                                <TableHead className={thClass} onClick={() => handleSort('speciality')}>
                                    Spécialité <SortIcon column="speciality" sortKey={sortKey} direction={sortDirection} />
                                </TableHead>
                                <TableHead className={thClass} onClick={() => handleSort('city')}>
                                    Ville <SortIcon column="city" sortKey={sortKey} direction={sortDirection} />
                                </TableHead>
                                <TableHead className={thClass} onClick={() => handleSort('price')}>
                                    Prix <SortIcon column="price" sortKey={sortKey} direction={sortDirection} />
                                </TableHead>
                                <TableHead className={thClass} onClick={() => handleSort('createdAt')}>
                                    Créé le <SortIcon column="createdAt" sortKey={sortKey} direction={sortDirection} />
                                </TableHead>
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
                                    <TableCell className="capitalize">{user.cookProfile?.speciality ?? '-'}</TableCell>
                                    <TableCell>{user.cookProfile?.city ?? '-'}</TableCell>
                                    <TableCell>{user.cookProfile?.price ?? '-'}/h</TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </main>
    )
}
