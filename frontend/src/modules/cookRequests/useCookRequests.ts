import { useQuery } from '@tanstack/react-query'
import type { CookRequest } from '@src/types/cookRequest.types'
import { cookRequestsMock } from './cookRequests.mock'

export type { CookRequest }

// TODO: replace with real fetch when API is ready
const fetchCookRequests = async (): Promise<CookRequest[]> => {
    // const response = await fetch('/api/backoffice/cook-requests')
    // if (!response.ok) throw new Error('Erreur lors de la récupération des demandes')
    // return response.json()
    return Promise.resolve(cookRequestsMock)
}

export const useCookRequests = () => {
    return useQuery({
        queryKey: ['backoffice', 'cook-requests'],
        queryFn: fetchCookRequests,
    })
}
