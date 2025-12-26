function isValidUrl(str) {
    try {
        const { protocol } = new URL(str)
        return protocol === "http:" || protocol === "https:"
    } catch (_) {
        return false
    }
}

export function ensureProtocol(str) {
    try {
        const url = new URL(str)
        return url.protocol === "http:" || url.protocol === "https:"
            ? str
            : `https://${str}`
    } catch {
        return `https://${str}`
    }
}

function isValidCode(code) {
    return /^[a-zA-Z0-9_-]{6,20}$/.test(code)
}

function isValidPassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/
    return passwordRegex.test(password)
}

module.exports = { isValidUrl, isValidCode, isValidPassword, treatUrl }
