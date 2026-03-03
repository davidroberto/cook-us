import { useQuery } from '@tanstack/react-query'
import type { BackofficeUser } from '@src/types/user.types'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'

export const useUser = (id: number) => {
    const { token } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'users', id],
        queryFn: () => apiFetch<BackofficeUser>(`/api/backoffice/users/${id}`, token),
        enabled: !!token,
    })
}
