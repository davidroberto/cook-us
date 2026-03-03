import { useQuery } from '@tanstack/react-query'
import type { BackofficeUser } from '@src/types/user.types'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'

export type { BackofficeUser }

export const useUsers = () => {
    const { token } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'users'],
        queryFn: () => apiFetch<BackofficeUser[]>('/api/backoffice/users', token),
        enabled: !!token,
    })
}
