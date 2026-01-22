export interface Link {
    url: string
    code: string
    passwordHash?: string | null
    protected: boolean
    custom?: boolean
    clicks?: number
}

export interface CreateLinkData {
    url: string,
    code: string,
    password?: string,
    custom: boolean,
}

export type CreateLinkPersistence = {
    url: string
    code: string
    passwordHash: string | null
    protected: boolean
    custom: boolean
}

export type RedirectResult =
  | { protected: true }
  | { protected: false; url: string }