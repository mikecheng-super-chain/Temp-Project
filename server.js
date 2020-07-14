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
    require('dotenv').config()//'.load()' ===> '.config()'.
  }

//express
//https://expressjs.com/zh-tw/api.html
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')//?
const indexRouter = require('./routes/index')//?
const usersRouter = require('./routes/users')//?
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  name => users.find(user => user.name === name),
  id => users.find(user => user.id === id)
)
//MongoDB
const mongoose = require('mongoose')
const users = require('./models/users')
const db = mongoose.connection

//Specify 'ejs' as 'view-engine'.
app.set('view engine', 'ejs')
//Specify __dirname as 'views' with address '/views'.
//__dirname returns the path of the folder where the current JavaScript file resides.
app.set('views', __dirname, '/views')
//Specify 'layouts/layout' as 'layout'.
app.set('layout', 'views/layouts/layout')

app.use(expressLayouts)
//Serve static content for the app from the “public” directory.
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
//?Set router path?
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//To listen connections from 'process.env.PORT' or port(3000).
app.listen(process.env.PORT || 3000)

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


//////////////

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('views/login.ejs', { users: new users() })
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('views/register.ejs', { users: new users() })
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
//vvv Ref vvv
//Linked to the 'login' page.
/*
app.get('/login', (req, res) => {
  res.render('views/login.ejs', { users: new users() })//?{users: new users()} correct?
})
//Linked to the 'register' page.
app.get('/register', (req, res) => {
  res.render('views/register.ejs', { users: new users() })
})
*/