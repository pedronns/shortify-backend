export interface Link {
    url: string
    code: string
    clicks?: number
    passwordHash?: string
    protected: boolean
    custom?: boolean
}