import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useUser } from './useUser'
import { usersMock } from './users.mock'

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

describe('useUser', () => {
    it('retourne le user correspondant à l\'ID', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify(usersMock[0]), { status: 200 }),
        )

        const { result } = renderHook(() => useUser(usersMock[0].id), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.id).toBe(usersMock[0].id)
        expect(result.current.data?.firstName).toBe(usersMock[0].firstName)
    })

    it('passe en état d\'erreur pour un ID inexistant', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ message: 'Not Found' }), { status: 404 }),
        )

        const { result } = renderHook(() => useUser(999), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isError).toBe(true))
    })

    it('commence en état isLoading', () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify(usersMock[0]), { status: 200 }),
        )

        const { result } = renderHook(() => useUser(1), { wrapper: createWrapper() })
        expect(result.current.isLoading).toBe(true)
    })
})
