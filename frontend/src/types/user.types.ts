export type UserRole = 'client' | 'cook' | 'admin'
export type CookSpeciality = 'french_cooking' | 'italian_cooking' | 'asian_cooking' | 'mexican_cooking' | 'vegetarian_cooking' | 'pastry_cooking' | 'japanese_cooking' | 'indian_cooking' | 'autre'

export type BackofficeUser = {
    id: number
    firstName: string
    lastName: string
    email: string
    thumbnail: string | null
    role: UserRole
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    cookProfile: {
        id: string
        description: string
        speciality: CookSpeciality
        hourlyRate: number | null
        city: string
        siret: string | null
        isValidated: boolean
        validationStatus: 'pending' | 'validated' | 'refused'
    } | null
}
