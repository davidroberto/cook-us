import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useCookRequests } from './useCookRequests'
import { cookRequestsMock } from './cookRequests.mock'

vi.mock('@src/contexts/useAuth', () => ({
    useAuth: () => ({ token: 'test-token' }),
}))

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children)
}

beforeEach(() => {
    vi.restoreAllMocks()
})

describe('useCookRequests', () => {
    it('retourne la liste des demandes', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify(cookRequestsMock), { status: 200 }),
        )

        const { result } = renderHook(() => useCookRequests(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data).toHaveLength(cookRequestsMock.length)
    })

    it('chaque demande a un statut valide', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify(cookRequestsMock), { status: 200 }),
        )

        const { result } = renderHook(() => useCookRequests(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        const validStatuses = ['pending', 'accepted', 'refused', 'cancelled']
        result.current.data?.forEach((req) => {
            expect(validStatuses).toContain(req.status)
        })
    })

    it('commence en état isLoading', () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify(cookRequestsMock), { status: 200 }),
        )

        const { result } = renderHook(() => useCookRequests(), { wrapper: createWrapper() })
        expect(result.current.isLoading).toBe(true)
    })
})
