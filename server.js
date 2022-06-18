const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

require('./config/passport')(passport)
// Important constants
const app = express()
const PORT = process.env.PORT || 5000



dotenv.config()

// Middlewares
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended : false })) // <= Body Parser
app.use(session({
    secret : 'session secret',
    resave : false,
    saveUninitialized : true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
  //  req.locals.err_msg = req.flash('err_msg')
    next()
})

// MongoDB Connection
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log(`Connected to MongoDB Database`);
})




// Routing 
const userRouter = require('./router/usersRouter')
app.use('/users', userRouter)
const dashboardRouter = require('./router/dashboardRouter')
app.use('/dashboard', dashboardRouter)

// Index Page
app.get('/', (req, res) => {
    res.render("welcome")
})

// Listening to HTTP requests
app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
})