import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useRejectCook } from './useRejectCook'

vi.mock('@src/contexts/useAuth', () => ({
    useAuth: () => ({ token: 'test-token' }),
}))

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children)
}

beforeEach(() => {
    vi.restoreAllMocks()
})

describe('useRejectCook', () => {
    it('appelle PATCH /api/backoffice/users/:id/reject', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ isValidated: false }), { status: 200 }),
        )

        const { result } = renderHook(() => useRejectCook(), { wrapper: createWrapper() })
        act(() => result.current.mutate(2))

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(fetchSpy).toHaveBeenCalledWith(
            '/api/backoffice/users/2/reject',
            expect.objectContaining({ method: 'PATCH' }),
        )
    })

    it('envoie le token d\'authentification dans le header', async () => {
        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ isValidated: false }), { status: 200 }),
        )

        const { result } = renderHook(() => useRejectCook(), { wrapper: createWrapper() })
        act(() => result.current.mutate(2))

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
            }),
        )
    })

    it('passe en état d\'erreur si l\'utilisateur n\'est pas un cuisinier', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(
                JSON.stringify({ message: "L'utilisateur cible n'est pas un cuisinier" }),
                { status: 400 },
            ),
        )

        const { result } = renderHook(() => useRejectCook(), { wrapper: createWrapper() })
        act(() => result.current.mutate(1))

        await waitFor(() => expect(result.current.isError).toBe(true))
        expect(result.current.error?.message).toBe("L'utilisateur cible n'est pas un cuisinier")
    })

    it('passe en état d\'erreur si l\'utilisateur est introuvable', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(
                JSON.stringify({ message: 'Utilisateur #999 introuvable' }),
                { status: 404 },
            ),
        )

        const { result } = renderHook(() => useRejectCook(), { wrapper: createWrapper() })
        act(() => result.current.mutate(999))

        await waitFor(() => expect(result.current.isError).toBe(true))
        expect(result.current.error?.message).toBe('Utilisateur #999 introuvable')
    })

    it('commence en état idle avant la mutation', () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ isValidated: false }), { status: 200 }),
        )

        const { result } = renderHook(() => useRejectCook(), { wrapper: createWrapper() })
        expect(result.current.isIdle).toBe(true)
    })
})
