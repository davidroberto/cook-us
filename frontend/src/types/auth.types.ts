export type AuthUser = {
    id: number
    firstName: string
    lastName: string
    email: string
    role: 'admin' | 'cook' | 'client'
}
