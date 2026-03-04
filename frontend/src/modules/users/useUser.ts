import { useQuery } from '@tanstack/react-query'
import type { BackofficeUser } from '@src/types/user.types'
import { useAuth } from '@src/contexts/useAuth'

export const useUser = (id: number) => {
    const { token, apiFetch } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'users', id],
        queryFn: () => apiFetch<BackofficeUser>(`/api/backoffice/users/${id}`),
        enabled: !!token,
    })
}
