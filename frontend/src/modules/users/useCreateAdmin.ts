import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@src/contexts/useAuth'

type CreateAdminDto = {
    firstName: string
    lastName: string
    email: string
    password: string
}

export const useCreateAdmin = () => {
    const { apiFetch } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (dto: CreateAdminDto) =>
            apiFetch('/api/backoffice/users', {
                method: 'POST',
                body: JSON.stringify(dto),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['backoffice', 'users'] })
        },
    })
}
