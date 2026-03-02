export type UserRole = 'client' | 'cook' | 'admin'
export type CookSpeciality = 'indian' | 'french' | 'italien'

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
        description: string
        speciality: CookSpeciality
        hourlyRate: string
        city: string
    } | null
}
