import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'

export type PendingCook = {
    id: number
    firstName: string
    lastName: string
    email: string
    createdAt: string
    cookProfile: {
        siret: string | null
        speciality: string
        validationStatus: 'pending'
    }
}

export const usePendingCooks = () => {
    const { token, apiFetch: authApiFetch } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'pending-cooks'],
        queryFn: () => authApiFetch<PendingCook[]>('/api/backoffice/pending-cooks'),
        enabled: !!token,
    })
}

export const usePendingCookAction = (userId: number) => {
    const { token } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ approve }: { approve: boolean }) =>
            apiFetch(
                `/api/backoffice/users/${userId}/${approve ? 'validate' : 'reject'}`,
                token,
                { method: 'PATCH' },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['backoffice', 'pending-cooks'] })
            queryClient.invalidateQueries({ queryKey: ['backoffice', 'users', userId] })
        },
    })
}
