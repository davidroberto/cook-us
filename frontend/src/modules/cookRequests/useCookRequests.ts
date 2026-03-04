import { useQuery } from '@tanstack/react-query'
import type { CookRequest } from '@src/types/cookRequest.types'
import { useAuth } from '@src/contexts/useAuth'

export type { CookRequest }

export const useCookRequests = () => {
    const { token, apiFetch } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'cook-requests'],
        queryFn: () => apiFetch<CookRequest[]>('/api/backoffice/cook-requests'),
        enabled: !!token,
    })
}
