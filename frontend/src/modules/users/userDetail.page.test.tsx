import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserDetailPage } from './userDetail.page'
import * as useUserModule from './useUser'
import * as useCookRequestsModule from '@src/modules/cookRequests/useCookRequests'
import type { BackofficeUser } from '@src/types/user.types'
import type { CookRequest } from '@src/types/cookRequest.types'

vi.mock('./useUser', () => ({ useUser: vi.fn() }))
vi.mock('@src/modules/cookRequests/useCookRequests', () => ({ useCookRequests: vi.fn() }))

const renderPage = (userId = '2') => {
    const queryClient = new QueryClient()
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[`/users/${userId}`]}>
                <Routes>
                    <Route path="/users/:id" element={<UserDetailPage />} />
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>,
    )
}

const cookUser: BackofficeUser = {
    id: 2, firstName: 'Luca', lastName: 'Bianchi', email: 'luca@test.com',
    thumbnail: null, role: 'cook',
    createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
    deletedAt: null,
    cookProfile: { description: 'Chef italien', speciality: 'italian_cooking', hourlyRate: 45, city: 'Lyon' },
}

const clientUser: BackofficeUser = {
    ...cookUser, id: 1, role: 'client', cookProfile: null,
}

const mockRequest: CookRequest = {
    id: 1, status: 'accepted', guestsNumber: 6,
    startDate: '2026-03-10T19:00:00Z', endDate: '2026-03-10T22:00:00Z',
    cook: { id: 2, firstName: 'Luca', lastName: 'Bianchi' },
    client: { id: 1, firstName: 'Marie', lastName: 'Dupont' },
}

describe('UserDetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useCookRequestsModule.useCookRequests).mockReturnValue({
            data: [] as CookRequest[], isLoading: false, isError: false,
        } as ReturnType<typeof useCookRequestsModule.useCookRequests>)
    })

    it('affiche "Chargement..." pendant le chargement', () => {
        vi.mocked(useUserModule.useUser).mockReturnValue({
            data: undefined, isLoading: true, isError: false,
        } as ReturnType<typeof useUserModule.useUser>)
        renderPage()
        expect(screen.getByText('Chargement...')).toBeInTheDocument()
    })

    it('affiche "Utilisateur introuvable" si user est null', () => {
        vi.mocked(useUserModule.useUser).mockReturnValue({
            data: null, isLoading: false, isError: false,
        } as ReturnType<typeof useUserModule.useUser>)
        renderPage()
        expect(screen.getByText('Utilisateur introuvable.')).toBeInTheDocument()
    })

    it('affiche les informations du user', () => {
        vi.mocked(useUserModule.useUser).mockReturnValue({
            data: cookUser, isLoading: false, isError: false,
        } as ReturnType<typeof useUserModule.useUser>)
        renderPage()
        expect(screen.getByText('Luca Bianchi')).toBeInTheDocument()
        expect(screen.getByText('luca@test.com')).toBeInTheDocument()
    })

    it('affiche la section "Profil cuisinier" pour un cook', () => {
        vi.mocked(useUserModule.useUser).mockReturnValue({
            data: cookUser, isLoading: false, isError: false,
        } as ReturnType<typeof useUserModule.useUser>)
        renderPage()
        expect(screen.getByText('Profil cuisinier')).toBeInTheDocument()
        expect(screen.getByText('Chef italien')).toBeInTheDocument()
    })

    it('n\'affiche pas la section "Profil cuisinier" pour un client', () => {
        vi.mocked(useUserModule.useUser).mockReturnValue({
            data: clientUser, isLoading: false, isError: false,
        } as ReturnType<typeof useUserModule.useUser>)
        renderPage('1')
        expect(screen.queryByText('Profil cuisinier')).not.toBeInTheDocument()
    })

    it('affiche "Aucune demande." si aucune demande liée', () => {
        vi.mocked(useUserModule.useUser).mockReturnValue({
            data: cookUser, isLoading: false, isError: false,
        } as ReturnType<typeof useUserModule.useUser>)
        renderPage()
        expect(screen.getByText('Aucune demande.')).toBeInTheDocument()
    })

    it('affiche les demandes liées à ce user', () => {
        vi.mocked(useUserModule.useUser).mockReturnValue({
            data: cookUser, isLoading: false, isError: false,
        } as ReturnType<typeof useUserModule.useUser>)
        vi.mocked(useCookRequestsModule.useCookRequests).mockReturnValue({
            data: [mockRequest], isLoading: false, isError: false,
        } as ReturnType<typeof useCookRequestsModule.useCookRequests>)
        renderPage()
        expect(screen.getByText('Marie Dupont')).toBeInTheDocument()
        expect(screen.getByText('Acceptée')).toBeInTheDocument()
    })
})
