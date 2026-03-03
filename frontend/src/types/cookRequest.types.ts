export type CookRequest = {
    id: number
    guestsNumber: number
    startDate: string | null
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
