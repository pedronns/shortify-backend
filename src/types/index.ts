export interface Link {
    url: string
    code: string
    clicks?: number
    passwordHash?: string
    protected: boolean
    custom?: boolean
}

export type RedirectResult =
  | { protected: true }
  | { protected: false; url: string }