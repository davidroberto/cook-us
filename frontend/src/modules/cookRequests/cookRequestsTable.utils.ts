import type { CookRequest } from '@src/types/cookRequest.types'

export type SortKey = 'id' | 'cook' | 'client' | 'guestsNumber' | 'startDate' | 'endDate' | 'status'
export type SortDirection = 'asc' | 'desc'

export const getSortValue = (req: CookRequest, key: SortKey): string | number => {
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

export const sortRequests = (data: CookRequest[], key: SortKey, direction: SortDirection): CookRequest[] => {
    return [...data].sort((a, b) => {
        const valA = getSortValue(a, key)
        const valB = getSortValue(b, key)
        if (valA < valB) return direction === 'asc' ? -1 : 1
        if (valA > valB) return direction === 'asc' ? 1 : -1
        return 0
    })
}
