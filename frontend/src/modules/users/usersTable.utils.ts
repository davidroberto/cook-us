import type { BackofficeUser } from '@src/types/user.types'

export type SortKey = 'id' | 'name' | 'email' | 'role' | 'speciality' | 'hourlyRate' | 'city' | 'createdAt' | 'updatedAt'
export type SortDirection = 'asc' | 'desc'

export const getSortValue = (user: BackofficeUser, key: SortKey): string | number => {
    switch (key) {
        case 'id': return user.id
        case 'name': return `${user.lastName} ${user.firstName}`.toLowerCase()
        case 'email': return user.email.toLowerCase()
        case 'role': return user.role
        case 'speciality': return user.cookProfile?.speciality ?? '\uffff'
        case 'hourlyRate': return user.cookProfile?.hourlyRate ?? 99999
        case 'city': return user.cookProfile?.city.toLowerCase() ?? '\uffff'
        case 'createdAt': return new Date(user.createdAt).getTime()
        case 'updatedAt': return new Date(user.updatedAt).getTime()
    }
}

export const sortUsers = (data: BackofficeUser[], key: SortKey, direction: SortDirection): BackofficeUser[] => {
    return [...data].sort((a, b) => {
        const valA = getSortValue(a, key)
        const valB = getSortValue(b, key)
        if (valA < valB) return direction === 'asc' ? -1 : 1
        if (valA > valB) return direction === 'asc' ? 1 : -1
        return 0
    })
}
