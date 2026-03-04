import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'

export const useValidateCook = (userId: number) => {
    const { token } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ cookId, approve }: { cookId: string; approve: boolean }) =>
            apiFetch(
                `/api/backoffice/cooks/${cookId}/${approve ? 'validate' : 'refuse'}`,
                token,
                { method: 'PATCH' },
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['backoffice', 'users', userId] })
        },
    })
}
