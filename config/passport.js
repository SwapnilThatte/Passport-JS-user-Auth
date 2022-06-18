const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')


module.exports = async passport => {
    passport.use(
        new localStrategy({ usernameField : 'email' }, async (email, password, done) => {
            // Match User
           const user = await User.findOne({ email : email})
           if (!user) {
            return done(null, false, {message : 'Email is not registered'})
           }

           const isMatch = await bcrypt.compare(password, user.password)
           
           if (isMatch) {
            return done(null, user)
           }
           else {
            return done(null, false, {message : 'Incorrect Password'})
           }
        })
    )


    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

