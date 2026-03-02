import { useQuery } from '@tanstack/react-query'
import type { BackofficeUser } from '@src/types/user.types'

export type { BackofficeUser }

const fetchUsers = async (): Promise<BackofficeUser[]> => {
    const response = await fetch('/api/backoffice/users')
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs')
    }
    return response.json()
}

export const useUsers = () => {
    return useQuery({
        queryKey: ['backoffice', 'users'],
        queryFn: fetchUsers,
    })
}
