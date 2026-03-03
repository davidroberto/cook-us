import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from './login.page'
import * as useAuthModule from '@src/contexts/useAuth'
import * as authMock from './auth.mock'

vi.mock('@src/contexts/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('./auth.mock', () => ({ mockLogin: vi.fn() }))

const renderLoginPage = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        </QueryClientProvider>,
    )
}

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useAuthModule.useAuth).mockReturnValue({
            user: null, isLoading: false,
            login: vi.fn(), logout: vi.fn(),
        })
    })

    it('affiche le formulaire de connexion', () => {
        renderLoginPage()
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument()
    })

    it('affiche un message d\'erreur pour des identifiants incorrects', async () => {
        vi.mocked(authMock.mockLogin).mockRejectedValue(new Error('Identifiants incorrects'))
        renderLoginPage()

        await userEvent.type(screen.getByLabelText('Email'), 'wrong@test.com')
        await userEvent.type(screen.getByLabelText('Mot de passe'), 'badpassword')
        await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

        await waitFor(() => {
            expect(screen.getByText('Identifiants incorrects')).toBeInTheDocument()
        })
    })

    it('appelle login et redirige après une connexion réussie', async () => {
        const loginFn = vi.fn()
        vi.mocked(useAuthModule.useAuth).mockReturnValue({
            user: null, isLoading: false,
            login: loginFn, logout: vi.fn(),
        })
        vi.mocked(authMock.mockLogin).mockResolvedValue({ id: 4, email: 'admin@cookus.app', role: 'admin' })

        renderLoginPage()
        await userEvent.type(screen.getByLabelText('Email'), 'admin@cookus.app')
        await userEvent.type(screen.getByLabelText('Mot de passe'), 'admin1234')
        await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

        await waitFor(() => {
            expect(loginFn).toHaveBeenCalledWith({ id: 4, email: 'admin@cookus.app', role: 'admin' })
        })
    })
})
