module.exports = {
    ensureAuthenticated : (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        else {
            req.flash('success_msg', 'Please Try Again')
            res.redirect('/users/login')
        }
    }
}