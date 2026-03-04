import type { AuthUser } from '@src/types/auth.types'

const ADMIN_CREDENTIALS = {
    email: 'admin@cookus.app',
    password: 'admin1234',
}

const ADMIN_USER: AuthUser = {
    id: 4,
    firstName: 'Admin',
    lastName: 'Cook\'us',
    email: 'admin@cookus.app',
    role: 'admin',
}

// TODO: remove when API is ready
export const mockLogin = async (email: string, password: string): Promise<AuthUser> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        return ADMIN_USER
    }
    throw new Error('Identifiants incorrects')
}

// TODO: remove when API is ready
export const mockMe = async (): Promise<AuthUser | null> => {
    return null
}
