import { describe, it, expect } from 'vitest'
import { mockLogin, mockMe } from './auth.mock'

describe('mockLogin', () => {
    it('résout avec le user admin pour les bons identifiants', async () => {
        const user = await mockLogin('admin@cookus.app', 'admin1234')
        expect(user).toEqual({ id: 4, firstName: 'Admin', lastName: "Cook'us", email: 'admin@cookus.app', role: 'admin' })
    })

    it('rejette avec un message d\'erreur pour un mauvais mot de passe', async () => {
        await expect(mockLogin('admin@cookus.app', 'wrong')).rejects.toThrow('Identifiants incorrects')
    })

    it('rejette pour un email inconnu', async () => {
        await expect(mockLogin('unknown@test.com', 'admin1234')).rejects.toThrow('Identifiants incorrects')
    })
})

describe('mockMe', () => {
    it('retourne null (non authentifié par défaut)', async () => {
        const user = await mockMe()
        expect(user).toBeNull()
    })
})
