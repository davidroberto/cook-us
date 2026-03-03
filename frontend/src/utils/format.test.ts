import { describe, it, expect } from 'vitest'
import { formatDate } from './format'

describe('formatDate', () => {
    it('retourne "-" pour null', () => {
        expect(formatDate(null)).toBe('-')
    })

    it('formate une date en français', () => {
        const result = formatDate('2026-03-10T19:00:00Z')
        expect(result).toMatch(/10/)
        expect(result).toMatch(/2026/)
    })

    it('retourne "-" pour une string vide', () => {
        expect(formatDate('')).toBe('-')
    })
})
