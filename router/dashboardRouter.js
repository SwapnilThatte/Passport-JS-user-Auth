const router = require('express').Router()
const { ensureAuthenticated } = require('../config/auth')

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {name : req.user.name})
})

router.get('/info', ensureAuthenticated, (req, res) => {
    const context = {
        name : req.user.name,
        id : req.user.id, 
        email : req.user.email
    }
    console.log(`CONTEXT :\n`);
    console.log(req.user);
    res.render('info', context)
})

module.exports = router