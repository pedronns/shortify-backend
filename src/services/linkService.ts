import { LinkRepository } from "../repositories/linkRepository.ts"
import { PasswordUtils } from "../utils/passwordUtils.ts"
import { Link, CreateLinkData, RedirectResult } from "../types/index.ts"
import { env } from "../config/env.ts"

const API = env.apiUrl
if (!API) throw new Error("UNDEFINED_URL")

export class LinkService {
    constructor(private linkRepository: LinkRepository) {}

    async createLink(linkData: CreateLinkData): Promise<Link> {
        const { url, code, password, custom } = linkData

        if (url.includes(API)) throw new Error("RECURSIVE_LINK")

        let passwordHash: string | null = null
        let isProtected = false

        if (password) {
            passwordHash = await PasswordUtils.hash(password)
            isProtected = true
        }

        if (!custom && !isProtected) {
            const existing = await this.linkRepository.findByUrl(url)
            if (existing) {
                return {
                    url: existing.url,
                    code: existing.code,
                    protected: existing.protected,
                }
            }
        }

        const codeTaken = await this.linkRepository.findByCode(code)
        if (codeTaken) {
            throw new Error("CODE_TAKEN")
        }

        return await this.linkRepository.create({
            url,
            code,
            password,
            protected: isProtected,
            custom,
        })
    }

    async getLinkInfo(code: string) {
        const link = await this.linkRepository.findByCode(code)

        if (!link) {
            throw new Error("NOT_FOUND")
        }

        return {
            protected: link.protected,
            url: link.protected ? null : link.url,
        }
    }

    async unlockLink(code: string, password?: string): Promise<string> {
        const link = await this.linkRepository.findByCode(code)
        if (!link) throw new Error("NOT_FOUND")
        if (!link.passwordHash || !password) throw new Error("NOT_PROTECTED")

        const match = await PasswordUtils.compare(password, link.passwordHash)
        if (!match) throw new Error("INVALID_PASSWORD")

        return link.url
    }

    async deleteLink(code: string): Promise<void> {
        const deleted = await this.linkRepository.deleteByCode(code)

        if (!deleted) {
            throw new Error("NOT_FOUND")
        }
    }

    async handleRedirect(code: string): Promise<RedirectResult> {
        const link = await this.linkRepository.findByCode(code)
        if (!link) throw new Error("NOT_FOUND")
        if (link.protected) return { protected: true }

        await this.linkRepository.incrementClicks(code)
        return { protected: false, url: link.url }
    }
}
