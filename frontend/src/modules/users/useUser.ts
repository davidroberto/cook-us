import { useQuery } from '@tanstack/react-query'
import type { BackofficeUser } from '@src/types/user.types'
import { usersMock } from './users.mock'

// TODO: replace with real fetch when API is ready
const fetchUser = async (id: number): Promise<BackofficeUser | null> => {
    // const response = await fetch(`/api/backoffice/users/${id}`)
    // if (!response.ok) throw new Error('Utilisateur introuvable')
    // return response.json()
    return Promise.resolve(usersMock.find((u) => u.id === id) ?? null)
}

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['backoffice', 'users', id],
        queryFn: () => fetchUser(id),
    })
}
