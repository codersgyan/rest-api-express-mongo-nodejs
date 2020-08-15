const router = require('express').Router()
const Refresh = require('../models/Refresh')

router.delete('/', (req, res) => {
    Refresh.deleteOne({ token: req.body.token }).then(() => {
        return res.sendStatus(200)
    }).catch(err => {
        throw err
    })
})

module.exports = router