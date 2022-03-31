export const auth = (req, res, next) => {
    if (req.session && req.session.admin) {
        return next()
    }
    return res.sendStatus(401)
}