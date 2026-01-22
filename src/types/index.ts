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
    protected: boolean
}


export type RedirectResult =
  | { protected: true }
  | { protected: false; url: string }