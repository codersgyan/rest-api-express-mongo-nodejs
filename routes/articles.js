const router = require('express').Router()
const Article = require('../models/Article')
const auth = require('../middlewares/auth')

router.get('/', auth, (req, res) => {
    Article.find((err, articles) => {
        if(err) {
            throw err
        }
        res.send(articles)
    })
})

router.get('/:id', auth, (req, res) => {
    Article.findOne({ _id: req.params.id }, (err, article) => {
        if(err) {
            throw err
        }
        res.send(article)
    })
})

router.post('/', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author
    });

    // article.save((err, document) => {
    //     if(err) {
    //         throw err
    //     }
    //     return res.status(201).json(document)
    // })

    // article.save().then(document => {
    //     return res.status(201).json(document)
    // }).catch(err => {
    //     throw err
    // })

    try {
        const document = await article.save()
        return res.status(201).json(document)
    } catch(err){
        throw err
    }

})

router.patch('/:id', (req, res) => {
    Article.findOne({ _id: req.params.id }, (err, document) => {
        if(err) {
            throw err
        }
        if(document) {
            Article.updateOne({ _id: req.params.id}, 
                { 
                    title: req.body.title, 
                    body: req.body.body, 
                    author: req.body.author
                }).then(status => {
                    return res.json(req.body)
                }).catch(err => {
                    throw err
                })


            // Article.updateOne({ _id: req.params.id}, 
            //     { 
            //         title: req.body.title, 
            //         body: req.body.body, 
            //         author: req.body.author
            //     }, (err, status) =>{
            //         if(err) throw err
            //         return res.json(req.body)
            //     })
        } else {
            return res.status(404).send({error: 'Article not found'})
        }

    })
})

router.delete('/:id', (req, res) => {
    Article.deleteOne({ _id: req.params.id }).then(status => {
        return res.json({id: req.params.id})
    }).catch(err => {
        return res.status(500).json({ error: 'Something went wrong! '})
    })
})

module.exports = router