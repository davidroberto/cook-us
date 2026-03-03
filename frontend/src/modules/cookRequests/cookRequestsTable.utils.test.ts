import { describe, it, expect } from 'vitest'
import { getSortValue, sortRequests } from './cookRequestsTable.utils'
import type { CookRequest } from '@src/types/cookRequest.types'

const baseRequest = (overrides: Partial<CookRequest>): CookRequest => ({
    id: 1,
    status: 'pending',
    guestsNumber: 4,
    startDate: '2026-03-10T19:00:00Z',
    endDate: '2026-03-10T22:00:00Z',
    cook: { id: 2, firstName: 'Luca', lastName: 'Bianchi' },
    client: { id: 1, firstName: 'Marie', lastName: 'Dupont' },
    ...overrides,
})

describe('getSortValue', () => {
    it('retourne l\'id', () => {
        expect(getSortValue(baseRequest({ id: 7 }), 'id')).toBe(7)
    })

    it('retourne le nom du cuisinier trié par nom de famille', () => {
        const req = baseRequest({ cook: { id: 1, firstName: 'Luca', lastName: 'Bianchi' } })
        expect(getSortValue(req, 'cook')).toBe('bianchi luca')
    })

    it('retourne le statut', () => {
        expect(getSortValue(baseRequest({ status: 'accepted' }), 'status')).toBe('accepted')
    })

    it('retourne Infinity pour startDate null', () => {
        expect(getSortValue(baseRequest({ startDate: null }), 'startDate')).toBe(Infinity)
    })

    it('retourne le timestamp pour startDate non null', () => {
        const req = baseRequest({ startDate: '2026-03-10T19:00:00Z' })
        expect(getSortValue(req, 'startDate')).toBe(new Date('2026-03-10T19:00:00Z').getTime())
    })
})

describe('sortRequests', () => {
    const reqA = baseRequest({ id: 1, status: 'accepted', guestsNumber: 6 })
    const reqB = baseRequest({ id: 2, status: 'declined', guestsNumber: 2 })
    const reqC = baseRequest({ id: 3, status: 'pending', guestsNumber: 4 })

    it('trie par statut asc (accepted, declined, pending)', () => {
        const result = sortRequests([reqC, reqB, reqA], 'status', 'asc')
        expect(result[0].status).toBe('accepted')
        expect(result[1].status).toBe('declined')
        expect(result[2].status).toBe('pending')
    })

    it('trie par guestsNumber asc', () => {
        const result = sortRequests([reqA, reqB, reqC], 'guestsNumber', 'asc')
        expect(result[0].guestsNumber).toBe(2)
        expect(result[2].guestsNumber).toBe(6)
    })

    it('ne mute pas le tableau original', () => {
        const original = [reqA, reqB]
        sortRequests(original, 'id', 'asc')
        expect(original[0].id).toBe(1)
    })
})
