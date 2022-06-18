const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const passport = require('passport')

// GET Requests
router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})


// POST Request
router.post('/register', async (req, res, next) => {

    const { name, email, password, password2 } = req.body

    let errors = []

    // Check required fields 
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all fields' })
    }

    // Check password match
    if (password != password2) {
        errors.push({ msg: 'passwords do not match' })
    }

    // check password length
    if (password.length < 6) {
        errors.push({ msg: 'password should be at least 6 characters long' })
    }

    if (errors.length > 0) {
        const errContext = {
            errors,
            name,
            email,
            password,
            password2
        }
        res.render('register', errContext)
    }
    else {
        // Validation Passed
        const user = await User.findOne({ email: email })
        // Hashing Password

            const salt = bcrypt.genSaltSync(10, (err) => {
                console.log(`ERR ==> BCRYPT => SALT_GEN: ${err}`);
            })
            console.log(`SALT : ${salt}`);
            const hashedPassword = bcrypt.hashSync(password, salt, (err) => {
                console.log(`ERR ==> BCRYPT => PASS_HASH : ${err}`);
            })
            console.log(`HASHED PASS: ${hashedPassword}`);
        
        if (user) {
            errors.push({ msg: 'User Already Exists' })

            // User Already exists
            const errContext = {
                errors,
                name,
                email,
                password,
                password2
            }
            req.flash('err_msg', 'AN ERROR OCCOURED')
            res.render('register', errContext)
        }
        else {

            try {
                const newUser = new User({
                   name : name,
                   email : email,
                    password : hashedPassword
                })
               
                const savedUser = await newUser.save()
                console.log(savedUser);
               
                req.flash('success_msg', 'Registration Successful')
                res.redirect('login')


            }
            catch (err) {
                req.flash('err_msg', 'AN ERROR OCCOURED')
                console.log(`ERR OCCOURED\n==>\t ${err}`);
            }


        }
    }
})


router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req, res, next)
})


router.get('/logout', (req, res) => {
    req.logOut((err) => { })
    req.flash('Success_msg', 'Logged Out Successfully')
    res.redirect('/users/login')
})

module.exports = router 