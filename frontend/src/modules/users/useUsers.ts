import { useQuery } from '@tanstack/react-query'
import type { BackofficeUser } from '@src/types/user.types'
import { usersMock } from './users.mock'

export type { BackofficeUser }

// TODO: replace with real fetch when API is ready
const fetchUsers = async (): Promise<BackofficeUser[]> => {
    // const response = await fetch('/api/backoffice/users')
    // if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs')
    // return response.json()
    return Promise.resolve(usersMock)
}

export const useUsers = () => {
    return useQuery({
        queryKey: ['backoffice', 'users'],
        queryFn: fetchUsers,
    })
}
