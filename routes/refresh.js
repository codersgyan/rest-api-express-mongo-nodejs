const router = require('express').Router()
const Refresh = require('../models/Refresh')
const jwt = require('jsonwebtoken')

router.post('/', (req, res) =>{
    // check if token exits in db 
    if(!req.body.token) {
        return res.status(401).json({ error: 'Not valid token'}) 
    }
    Refresh.findOne({ token: req.body.token }).then(document => {
        if(document) {
            jwt.verify(req.body.token, process.env.JWT_REFRESH_SECRET, (err, user) => {
                // console.log('inREFRESH', user)
                if(err) {
                    // 403 Forbidden
                    return res.sendStatus(403)
                }
                const accessToken = jwt.sign({ 
                    name: user.name, 
                    email: user.email
                   }, 
                   process.env.JWT_SECRET, {expiresIn : '30s'});
                   return res.json({ accessToken: accessToken })
            })
        } else {
            // 401 Unauthorised
            return res.status(401).json({ error: 'Not valid token'})
        }
    }).catch(err => {
        throw err   
    })
})

module.exports = router