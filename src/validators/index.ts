function isValidUrl(url: string) {
    try {
        const { protocol } = new URL(url)
        return protocol === "http:" || protocol === "https:"
    } catch (_) {
        return false
    }
}

function treatUrl(url: string) {
    const hasProtocol = /^https?:\/\//i.test(url)

    if (hasProtocol) {
        return url
    }

    return `https://${url}`
}

function isValidCode(code: string) {
    return /^[a-zA-Z0-9_-]{6,20}$/.test(code)
}

function isValidPassword(password: string) {
    const passwordRegex = /^.{8,50}$/
    return passwordRegex.test(password)
}

export { isValidUrl, isValidCode, isValidPassword, treatUrl }
