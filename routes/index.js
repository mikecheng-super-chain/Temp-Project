const express = require('express')
//An isolated instance capable only of performing middleware and routing functions.
const router = express.Router()

router.get('/', (req, res) => {
    res.render('views/index.ejs', { name: 'Mike' })
})

module.exports = router