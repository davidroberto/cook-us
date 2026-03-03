import { describe, it, expect } from 'vitest'
import { getSortValue, sortUsers } from './usersTable.utils'
import type { BackofficeUser } from '@src/types/user.types'

const baseUser = (overrides: Partial<BackofficeUser>): BackofficeUser => ({
    id: 1,
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie@test.com',
    thumbnail: null,
    role: 'client',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z',
    deletedAt: null,
    cookProfile: null,
    ...overrides,
})

describe('getSortValue', () => {
    it('retourne l\'id', () => {
        expect(getSortValue(baseUser({ id: 42 }), 'id')).toBe(42)
    })

    it('retourne le nom trié par nom de famille d\'abord', () => {
        const user = baseUser({ firstName: 'Marie', lastName: 'Dupont' })
        expect(getSortValue(user, 'name')).toBe('dupont marie')
    })

    it('retourne l\'email en minuscules', () => {
        const user = baseUser({ email: 'MARIE@TEST.COM' })
        expect(getSortValue(user, 'email')).toBe('marie@test.com')
    })

    it('retourne \\uffff pour speciality si pas de cookProfile', () => {
        expect(getSortValue(baseUser({ cookProfile: null }), 'speciality')).toBe('\uffff')
    })

    it('retourne la speciality si cookProfile existe', () => {
        const user = baseUser({
            cookProfile: { description: '', speciality: 'french', hourlyRate: '40', city: 'Paris' },
        })
        expect(getSortValue(user, 'speciality')).toBe('french')
    })

    it('retourne 99999 pour hourlyRate si pas de cookProfile', () => {
        expect(getSortValue(baseUser({ cookProfile: null }), 'hourlyRate')).toBe(99999)
    })

    it('retourne le timestamp de createdAt', () => {
        const user = baseUser({ createdAt: '2026-01-01T00:00:00Z' })
        expect(getSortValue(user, 'createdAt')).toBe(new Date('2026-01-01T00:00:00Z').getTime())
    })
})

describe('sortUsers', () => {
    const userA = baseUser({ id: 1, firstName: 'Alice', lastName: 'Moreau', email: 'alice@test.com' })
    const userB = baseUser({ id: 2, firstName: 'Bob', lastName: 'Arnaud', email: 'bob@test.com' })

    it('trie par nom asc (Arnaud avant Moreau)', () => {
        const result = sortUsers([userA, userB], 'name', 'asc')
        expect(result[0].id).toBe(2)
        expect(result[1].id).toBe(1)
    })

    it('trie par nom desc (Moreau avant Arnaud)', () => {
        const result = sortUsers([userA, userB], 'name', 'desc')
        expect(result[0].id).toBe(1)
    })

    it('ne mute pas le tableau original', () => {
        const original = [userA, userB]
        sortUsers(original, 'name', 'asc')
        expect(original[0].id).toBe(1)
    })

    it('trie par id asc', () => {
        const result = sortUsers([userB, userA], 'id', 'asc')
        expect(result[0].id).toBe(1)
    })
})
