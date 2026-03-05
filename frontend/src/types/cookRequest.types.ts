export type CookRequestStatus = 'pending' | 'accepted' | 'refused' | 'cancelled' | 'completed'

export type CookRequest = {
    id: number
    status: CookRequestStatus
    guestsNumber: number
    startDate: string
    endDate: string | null
    cook: {
        id: number
        firstName: string
        lastName: string
    }
    client: {
        id: number
        firstName: string
        lastName: string
    }
}
