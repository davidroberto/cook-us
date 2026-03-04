import { useQuery } from '@tanstack/react-query'
import type { BackofficeUser } from '@src/types/user.types'
import { useAuth } from '@src/contexts/useAuth'

export type { BackofficeUser }

export const useUsers = () => {
    const { token, apiFetch } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'users'],
        queryFn: () => apiFetch<BackofficeUser[]>('/api/backoffice/users'),
        enabled: !!token,
    })
}
