export type UserRole = 'client' | 'cook' | 'admin'

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
        description: string | null
        speciality: string
        hourlyRate: number | null
        isActive: boolean
        isValidated: boolean
    } | null
}
