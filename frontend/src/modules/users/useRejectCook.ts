import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@src/contexts/useAuth'
import { apiFetch } from '@src/utils/api'

export const useRejectCook = () => {
    const { token } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userId: number) =>
            apiFetch(`/api/backoffice/users/${userId}/reject`, token, { method: 'PATCH' }),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['backoffice', 'users', userId] })
        },
    })
}
