const { handleRedirect } = require("../services")

async function redirectRoute(req, res) {
    const { code } = req.params
    const { password } = req.query

    try {
        const originalUrl = await handleRedirect(code, password)
        return res.redirect(301, originalUrl)
    } catch (error) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Link not found" })
        }

        if (error.message === "NEED_PASSWORD") {
            return res
                .status(401)
                .json({ error: "Password required", protected: true })
        }

        console.error(`Failed to redirect: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
}

module.exports = { redirectRoute }
