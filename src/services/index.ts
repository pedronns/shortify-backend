import { LinkModel } from "../database/models/link.ts"
import type { Link } from "../types/link.ts"
import bcrypt from "bcrypt"

const API = process.env.API_URL

if (!API) {
    throw new Error("UNDEFINED_URL")
}

async function createShortLink(
    url: string,
    code: string,
    password: string,
    custom: boolean
): Promise<Link> {
    let passwordHash = null
    let isProtected = false

    if (url.includes(API as string)) {
        throw new Error("RECURSIVE_LINK")
    }

    if (password) {
        passwordHash = await bcrypt.hash(password, 10)
        isProtected = true
    }

    if (!custom) {
        const urlTaken = await LinkModel.findOne({
            url,
            custom: false,
            protected: false,
        })

        if (urlTaken) {
            return {
                url: urlTaken.url,
                code: urlTaken.code,
                protected: urlTaken.protected,
            }
        }
    }

    // if custom code, check if it's already taken
    const codeTaken = await LinkModel.findOne({ code })
    if (codeTaken) {
        throw new Error("CODE_TAKEN")
    }

    const created = await LinkModel.create({
        url,
        code,
        passwordHash,
        protected: isProtected,
    })

    return {
        url: created.url,
        code: created.code,
        protected: created.protected,
    }
}

async function unlockLink(code: string, password?: string): Promise<string> {
    const link = await LinkModel.findOne({ code })

    if (!link) {
        throw new Error("NOT_FOUND")
    }

    if (!link.passwordHash || !password) {
        throw new Error("NOT_PROTECTED")
    }


    const match = await bcrypt.compare(password, link.passwordHash)

    if (!match) {
        throw new Error("INVALID_PASSWORD")
    }

    return link.url
}

async function handleRedirect(code: string, password?: string): Promise<string> {
    const link = await LinkModel.findOne({ code })

    if (!link) {
        throw new Error("NOT_FOUND")
    }

    if (link.protected) {
        if (!link.passwordHash || !password) {
            throw new Error("NEED_PASSWORD")
        }

        const match = bcrypt.compare(password, link.passwordHash)
        if (!match) {
            throw new Error("INVALID_PASSWORD")
        }
    }

    link.clicks++
    await link.save()
    return link.url
}

export { handleRedirect, createShortLink, unlockLink }
