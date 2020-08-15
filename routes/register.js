const router = require('express').Router()
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Refresh = require('../models/Refresh')
router.post('/', (req, res) => {
    // Authorize the request 

    // Validate the request

    // check for required 
    // if(!req.body.email || !req.body.password) {
    //    return res.status(422).json({ error: 'All fields are required'})
    // }
    // validate email 
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email(),
        password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    })

    const { error, value } = schema.validate(req.body);
    if(error) {
        return res.status(422).json({ error: error.details[0].message})
    }
    // check if user exist 
    User.exists({ email: req.body.email }, async (err, result) => {
        if(result) {
            return res.status(422).json({ error: 'User with this email already exist!'});     
        }
        // Hash the password 
     const hashedPassword = await bcrypt.hash(req.body.password, 10)
     const user = new User({
         name: req.body.name,
         email: req.body.email,
         password: hashedPassword
     })
     user.save().then(response => {  
         const accessToken = jwt.sign({ 
             name: response.name, email: response.email
            }, 
            process.env.JWT_SECRET, {expiresIn : '30s'});

   // Later  ===========================
    const refreshToken = jwt.sign({ 
        name: response.name, email: response.email
        }, 
        process.env.JWT_REFRESH_SECRET);

           // Save refresh token in database 
            const refreshTokenDocument = new Refresh({
                token: refreshToken
            }).save().then(doc => {
                return res.send({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    type: 'Bearer'
                })
            }).catch(err => {
                throw err
            })
        
     }).catch(err => {
         return res.status(500).send({ error: 'Something went wrong'});
     })
     
    })
})


module.exports = router

