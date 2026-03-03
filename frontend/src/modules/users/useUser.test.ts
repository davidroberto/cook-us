import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useUser } from './useUser'

const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    return ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useUser', () => {
    it('retourne le user correspondant à l\'ID', async () => {
        const { result } = renderHook(() => useUser(1), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.id).toBe(1)
        expect(result.current.data?.firstName).toBe('Marie')
    })

    it('retourne null pour un ID inexistant', async () => {
        const { result } = renderHook(() => useUser(999), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data).toBeNull()
    })

    it('commence en état isLoading', () => {
        const { result } = renderHook(() => useUser(1), { wrapper: createWrapper() })
        expect(result.current.isLoading).toBe(true)
    })
})
