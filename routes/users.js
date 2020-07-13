const express = require('express')
const router = express.Router()
const users = require('../models/users')
const { response } = require('express')

// All Users Route
router.get('/', async (req, res) => {
    res.render('views/users/index')
})

// New Users Route
router.get('/new', (req, res) => {
    res.render('views/users/new', { users: new users() })
  })

// Create Users Route
router.post('/', async (req, res) => {
    //response.send(req.body.name)
    res.render('views/index.ejs', { name: req.body.name })
})

module.exports = router