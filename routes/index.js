const express = require('express')
//An isolated instance capable only of performing middleware and routing functions.
const router = express.Router()

/*
router.get('/', (req, res) => {
    res.render('views/index.ejs', { name: req.body.name })
})
*/

module.exports = router