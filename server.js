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


//vvv Ref vvv
//Linked to the 'login' page.
app.get('/login', (req, res) => {
  res.render('views/login.ejs')
})
//Linked to the 'register' page.
app.get('/register', (req, res) => {
  res.render('views/register.ejs', { users: new users() })
})