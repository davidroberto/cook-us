import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './protectedRoute'
import * as useAuthModule from '@src/contexts/useAuth'
import type { AuthContextValue } from '@src/contexts/useAuth'

vi.mock('@src/contexts/useAuth', () => ({
    useAuth: vi.fn(),
}))

const mockUseAuth = (value: Partial<AuthContextValue>) => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
        user: null,
        isLoading: false,
        login: vi.fn(),
        logout: vi.fn(),
        ...value,
    })
}

const renderWithRouter = (initialPath = '/protected') =>
    render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/login" element={<div>Page de connexion</div>} />
                <Route
                    path="/protected"
                    element={
                        <ProtectedRoute>
                            <div>Contenu protégé</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>,
    )

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('affiche le loader pendant isLoading', () => {
        mockUseAuth({ isLoading: true, user: null })
        renderWithRouter()
        expect(screen.getByText('Chargement...')).toBeInTheDocument()
        expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
    })

    it('redirige vers /login si user est null', () => {
        mockUseAuth({ isLoading: false, user: null })
        renderWithRouter()
        expect(screen.getByText('Page de connexion')).toBeInTheDocument()
        expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
    })

    it('affiche les children si user est authentifié', () => {
        mockUseAuth({ isLoading: false, user: { id: 4, email: 'admin@cookus.app', role: 'admin' } })
        renderWithRouter()
        expect(screen.getByText('Contenu protégé')).toBeInTheDocument()
    })
})
