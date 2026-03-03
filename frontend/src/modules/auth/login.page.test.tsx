import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginPage } from './login.page'
import * as useAuthModule from '@src/contexts/useAuth'

vi.mock('@src/contexts/useAuth', () => ({ useAuth: vi.fn() }))

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
            user: null, token: null, isLoading: false,
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
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ message: 'Identifiants incorrects' }), { status: 401 }),
        )
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
            user: null, token: null, isLoading: false,
            login: loginFn, logout: vi.fn(),
        })
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ token: 'jwt-token', user: { id: 4, email: 'admin@cookus.app', role: 'admin' } }), { status: 200 }),
        )

        renderLoginPage()
        await userEvent.type(screen.getByLabelText('Email'), 'admin@cookus.app')
        await userEvent.type(screen.getByLabelText('Mot de passe'), 'admin1234')
        await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

        await waitFor(() => {
            expect(loginFn).toHaveBeenCalledWith(
                { id: 4, email: 'admin@cookus.app', role: 'admin' },
                'jwt-token',
            )
        })
    })
})
