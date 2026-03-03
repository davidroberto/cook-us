import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useCookRequests } from './useCookRequests'

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useCookRequests', () => {
    it('retourne la liste des demandes', async () => {
        const { result } = renderHook(() => useCookRequests(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data).toHaveLength(4)
    })

    it('chaque demande a un statut valide', async () => {
        const { result } = renderHook(() => useCookRequests(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        const validStatuses = ['pending', 'accepted', 'declined']
        result.current.data?.forEach((req) => {
            expect(validStatuses).toContain(req.status)
        })
    })

    it('commence en état isLoading', () => {
        const { result } = renderHook(() => useCookRequests(), { wrapper: createWrapper() })
        expect(result.current.isLoading).toBe(true)
    })
})
