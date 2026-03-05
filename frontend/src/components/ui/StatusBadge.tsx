import type { CookRequestStatus } from '@src/types/cookRequest.types'

const STATUS_CONFIG: Record<CookRequestStatus, { label: string; className: string }> = {
    pending:   { label: 'En attente', className: 'bg-yellow-100 text-yellow-800' },
    accepted:  { label: 'Acceptée',   className: 'bg-green-100 text-green-800' },
    refused:   { label: 'Refusée',    className: 'bg-red-100 text-red-800' },
    cancelled: { label: 'Annulée',    className: 'bg-gray-100 text-gray-600' },
    completed: { label: 'Terminée',   className: 'bg-blue-100 text-blue-800' },
}

export const StatusBadge = ({ status }: { status: CookRequestStatus }) => {
    const { label, className } = STATUS_CONFIG[status]
    return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
            {label}
        </span>
    )
}
