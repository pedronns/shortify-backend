import { Link } from "../database/models/link.js"
import bcrypt from "bcrypt"

const API = process.env.API_URL

async function createShortLink(url, code, password, custom) {
    let passwordHash = null
    let isProtected = false

    if (url.includes(API)) {
        throw new Error("RECURSIVE_LINK")
    }

    if (password) {
        passwordHash = await bcrypt.hash(password, 10)
        isProtected = true
    }

    if (!custom) {
        const urlTaken = await Link.findOne({
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
    const codeTaken = await Link.findOne({ code })
    if (codeTaken) {
        throw new Error("CODE_TAKEN")
    }

    const created = await Link.create({
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

async function unlockLink(code, password) {
    const link = await Link.findOne({ code })

    if (!link) {
        throw new Error("NOT_FOUND")
    }

    if (!link.protected) {
        throw new Error("NOT_PROTECTED")
    }

    const match = await bcrypt.compare(password, link.passwordHash)

    if (!match) {
        throw new Error("INVALID_PASSWORD")
    }

    return link.url
}

async function handleRedirect(code, password) {
    const link = await Link.findOne({ code })

    if (!link) {
        throw new Error("NOT_FOUND")
    }

    if (link.protected) {
        if (!password) {
            throw new Error("NEED_PASSWORD")
        }

        const match = await bcrypt.compare(password, link.passwordHash)
        if (!match) {
            throw new Error("INVALID_PASSWORD")
        }
    }

    link.clicks++
    await link.save()
    return link.url
}

export { handleRedirect, createShortLink, unlockLink }
