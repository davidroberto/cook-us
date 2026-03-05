import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'

export const useValidateCook = (userId: number) => {
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
            queryClient.invalidateQueries({ queryKey: ['backoffice', 'users', userId] })
        },
    })
}
