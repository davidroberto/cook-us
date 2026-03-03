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
import { useCookRequests, type CookRequest } from './useCookRequests'
import type { CookRequestStatus } from '@src/types/cookRequest.types'

type SortKey = 'id' | 'cook' | 'client' | 'guestsNumber' | 'startDate' | 'endDate' | 'status'

const STATUS_CONFIG: Record<CookRequestStatus, { label: string; className: string }> = {
    pending:  { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
    accepted: { label: 'Acceptée',   className: 'bg-green-100 text-green-800' },
    declined: { label: 'Refusée',    className: 'bg-red-100 text-red-800' },
}

const StatusBadge = ({ status }: { status: CookRequestStatus }) => {
    const { label, className } = STATUS_CONFIG[status]
    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
            {label}
        </span>
    )
}
type SortDirection = 'asc' | 'desc'

const formatDate = (value: string | null) => {
    if (!value) return '-'
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))
}

const getSortValue = (req: CookRequest, key: SortKey): string | number => {
    switch (key) {
        case 'id': return req.id
        case 'cook': return `${req.cook.lastName} ${req.cook.firstName}`.toLowerCase()
        case 'client': return `${req.client.lastName} ${req.client.firstName}`.toLowerCase()
        case 'guestsNumber': return req.guestsNumber
        case 'startDate': return req.startDate ? new Date(req.startDate).getTime() : Infinity
        case 'endDate': return req.endDate ? new Date(req.endDate).getTime() : Infinity
        case 'status': return req.status
    }
}

const sortRequests = (data: CookRequest[], key: SortKey, direction: SortDirection) => {
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

export const CookRequestsTablePage = () => {
    const [sortKey, setSortKey] = useState<SortKey | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection | null>(null)

    const { data, isLoading, isError } = useCookRequests()

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

    const requests = data ?? []
    const sortedRequests = sortKey && sortDirection ? sortRequests(requests, sortKey, sortDirection) : requests

    const thClass = 'cursor-pointer select-none hover:text-foreground'

    return (
        <main className="min-h-screen bg-[#FDF6E7] p-6 text-foreground md:p-10">
            <section className="mx-auto w-full max-w-7xl space-y-4">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Demandes de cuisinier</h1>
                    <p className="text-sm text-muted-foreground">Backoffice - gestion des demandes Cook&apos;us</p>
                </header>

                <div className="rounded-lg border bg-card p-4">
                    {isError && (
                        <p className="py-8 text-center text-sm text-destructive">
                            Impossible de charger les demandes.
                        </p>
                    )}

                    {isLoading && (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Chargement...
                        </p>
                    )}

                    {!isLoading && !isError && (
                        <Table>
                            <TableCaption>Liste des demandes ({requests.length})</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={thClass} onClick={() => handleSort('id')}>
                                        ID <SortIcon column="id" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('cook')}>
                                        Cuisinier <SortIcon column="cook" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('client')}>
                                        Client <SortIcon column="client" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('guestsNumber')}>
                                        Convives <SortIcon column="guestsNumber" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('startDate')}>
                                        Début <SortIcon column="startDate" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('endDate')}>
                                        Fin <SortIcon column="endDate" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                    <TableHead className={thClass} onClick={() => handleSort('status')}>
                                        Statut <SortIcon column="status" sortKey={sortKey} direction={sortDirection} />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedRequests.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium">{req.id}</TableCell>
                                        <TableCell>{req.cook.firstName} {req.cook.lastName}</TableCell>
                                        <TableCell>{req.client.firstName} {req.client.lastName}</TableCell>
                                        <TableCell>{req.guestsNumber}</TableCell>
                                        <TableCell>{formatDate(req.startDate)}</TableCell>
                                        <TableCell>{formatDate(req.endDate)}</TableCell>
                                        <TableCell><StatusBadge status={req.status} /></TableCell>
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
