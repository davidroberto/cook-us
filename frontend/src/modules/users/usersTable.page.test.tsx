import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UsersTablePage } from './usersTable.page'
import * as useUsersModule from './useUsers'
import type { BackofficeUser } from '@src/types/user.types'

vi.mock('./useUsers', () => ({ useUsers: vi.fn() }))

const renderPage = () => {
    const queryClient = new QueryClient()
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <UsersTablePage />
            </MemoryRouter>
        </QueryClientProvider>,
    )
}

const makeUser = (overrides: Partial<BackofficeUser>): BackofficeUser => ({
    id: 1, firstName: 'Marie', lastName: 'Dupont', email: 'marie@test.com',
    thumbnail: null, role: 'client',
    createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
    deletedAt: null, cookProfile: null,
    ...overrides,
})

describe('UsersTablePage', () => {
    beforeEach(() => vi.clearAllMocks())

    it('affiche "Chargement..." pendant le chargement', () => {
        vi.mocked(useUsersModule.useUsers).mockReturnValue({
            data: undefined, isLoading: true, isError: false,
        } as ReturnType<typeof useUsersModule.useUsers>)
        renderPage()
        expect(screen.getByText('Chargement...')).toBeInTheDocument()
    })

    it('affiche un message d\'erreur si la requête échoue', () => {
        vi.mocked(useUsersModule.useUsers).mockReturnValue({
            data: undefined, isLoading: false, isError: true,
        } as ReturnType<typeof useUsersModule.useUsers>)
        renderPage()
        expect(screen.getByText('Impossible de charger les utilisateurs.')).toBeInTheDocument()
    })

    it('affiche les utilisateurs actifs', () => {
        vi.mocked(useUsersModule.useUsers).mockReturnValue({
            data: [makeUser({ id: 1, firstName: 'Alice', lastName: 'Martin' })],
            isLoading: false, isError: false,
        } as ReturnType<typeof useUsersModule.useUsers>)
        renderPage()
        expect(screen.getByText('Alice Martin')).toBeInTheDocument()
    })

    it('ne montre pas les utilisateurs supprimés', () => {
        vi.mocked(useUsersModule.useUsers).mockReturnValue({
            data: [
                makeUser({ id: 1, firstName: 'Alice', lastName: 'Martin', deletedAt: null }),
                makeUser({ id: 2, firstName: 'Bob', lastName: 'Supprimé', deletedAt: '2026-02-01T00:00:00Z' }),
            ],
            isLoading: false, isError: false,
        } as ReturnType<typeof useUsersModule.useUsers>)
        renderPage()
        expect(screen.getByText('Alice Martin')).toBeInTheDocument()
        expect(screen.queryByText('Bob Supprimé')).not.toBeInTheDocument()
    })
})
