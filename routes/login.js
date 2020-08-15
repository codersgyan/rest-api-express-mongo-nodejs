const router = require('express').Router()
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Refresh = require('../models/Refresh')
router.post('/', (req, res) => {
    // check for required 
    // if(!req.body.email || !req.body.password) {
    //    return res.status(422).json({ error: 'All fields are required'})
    // }
    // validate email 
    const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string()
        .required()
    })

    const { error, value } = schema.validate(req.body);
    if(error) {
        return res.status(422).json({ error: error.details[0].message})
    }
    // check if user exist 
    User.findOne({ email: req.body.email }, async (err, result) => {
        if(err) {
            throw err;
        }
        if(result) {
            // all good 
            bcrypt.compare(req.body.password, result.password).then(function(match) {
                if(match) {
                    const accessToken = jwt.sign({ 
                        name: result.name, email: result.email
                       }, 
                       process.env.JWT_SECRET, {expiresIn : '30s'});
                        // LATER ====================
                        const refreshToken = jwt.sign({ 
                        name: result.name, email: result.email
                        }, 
                        process.env.JWT_REFRESH_SECRET);

                        // Save refresh token in database 
                        const refreshTokenDocument = new Refresh({
                            token: refreshToken
                        }).save().then(doc => {
                           
                        }).catch(err => {
                            throw err
                        })
                        return res.send({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            type: 'Bearer'
                        })
                }
                // 401 unauthorised 
                return res.status(401).json({ error: 'Username or password is wrong!'})
            });
        } else {
            return res.status(401).json({ error: 'Username or password is wrong!'})
        }
    })
})


module.exports = router

