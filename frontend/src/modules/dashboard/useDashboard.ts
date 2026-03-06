import { useQuery } from '@tanstack/react-query'
import type { DashboardStats } from '@src/types/dashboard.types'
import { useAuth } from '@src/contexts/useAuth'

export const useDashboard = (period: number) => {
    const { token, apiFetch } = useAuth()

    return useQuery({
        queryKey: ['backoffice', 'dashboard', period],
        queryFn: () => apiFetch<DashboardStats>(`/api/backoffice/dashboard?period=${period}`),
        enabled: !!token,
    })
}
