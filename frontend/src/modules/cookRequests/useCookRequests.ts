import { useQuery } from '@tanstack/react-query'
import type { CookRequest } from '@src/types/cookRequest.types'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'

export type { CookRequest }

export const useCookRequests = () => {
    const { token } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'cook-requests'],
        queryFn: () => apiFetch<CookRequest[]>('/api/backoffice/cook-requests', token),
        enabled: !!token,
    })
}
