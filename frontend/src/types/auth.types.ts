export type AuthUser = {
    id: number
    email: string
    role: 'admin' | 'cook' | 'client'
}
