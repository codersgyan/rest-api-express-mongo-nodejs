const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    let authHeader = req.headers.authorization
    if(authHeader) {
        let token = authHeader.split(' ')[1];
        console.log(authHeader)
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } else {
        // 401 - unathorised
        // 403 - Forbidden, i know who are you but you dont permissions
        res.sendStatus(401)
    }
}

module.exports = auth