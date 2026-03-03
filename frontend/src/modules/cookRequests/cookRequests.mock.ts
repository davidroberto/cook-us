import type { CookRequest } from '@src/types/cookRequest.types'

export const cookRequestsMock: CookRequest[] = [
    {
        id: 1,
        status: 'accepted',
        guestsNumber: 6,
        startDate: '2026-03-10T19:00:00Z',
        endDate: '2026-03-10T22:00:00Z',
        cook: { id: 2, firstName: 'Luca', lastName: 'Bianchi' },
        client: { id: 1, firstName: 'Marie', lastName: 'Dupont' },
    },
    {
        id: 2,
        status: 'pending',
        guestsNumber: 4,
        startDate: '2026-03-15T12:00:00Z',
        endDate: '2026-03-15T14:30:00Z',
        cook: { id: 3, firstName: 'Aïcha', lastName: 'Martin' },
        client: { id: 1, firstName: 'Marie', lastName: 'Dupont' },
    },
    {
        id: 3,
        status: 'pending',
        guestsNumber: 10,
        startDate: '2026-04-01T18:00:00Z',
        endDate: null,
        cook: { id: 6, firstName: 'Thomas', lastName: 'Leroy' },
        client: { id: 7, firstName: 'Paul', lastName: 'Bernard' },
    },
    {
        id: 4,
        status: 'declined',
        guestsNumber: 2,
        startDate: null,
        endDate: null,
        cook: { id: 2, firstName: 'Luca', lastName: 'Bianchi' },
        client: { id: 8, firstName: 'Sophie', lastName: 'Moreau' },
    },
]
