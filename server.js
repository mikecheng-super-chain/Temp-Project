//Save and update the local host:
//npm run devStart

//Upload to GitHub:
//git add .
//git commit -m "Testing"
//git push

//Update Heroku:
//git push heroku master

//To check we are in devlopment environment or not.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
//MongoDB
const mongoose = require('mongoose')
const users = require('./models/users')
const db = mongoose.connection

//Use 'const users = []' while with out a database.
//const users = []

const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true    
}))

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', (req, res) => {
    (async() => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword 
        })
        res.redirect('/login')
    }
    catch {
        res.redirect('/register')
    }
    console.log(users)
    })();
})

//Function to protect the system's information access from non-login users.
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

//Connect to MongoDB
//Use 'DATABASE_URL' to set the path in '.env' file. 
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,//?Can be delete?
    useFindAndModify: false,//?Can be delete?
    useCreateIndex: true//?Can be delete?
  })
  //To check and show whether there have any connection error.
  db.on('error', error => console.error(error))
  //To check whether the server is connected to MongoDB.
  db.once('open', () => console.log('Connected to Mongoose'))


app.listen(process.env.PORT || 3000)
//app.listen(3000)