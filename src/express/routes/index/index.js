const express = require('express');
const router = express.Router();
const { GetAllProducts } = require('../../../mongodb/Controllers/product')
const { GetTimeNow } = require('../../../tools/tools')

router.get('/', (req, res) => {
    let notAuth = req.session.notAuth
    let userText = ''
    let userID = ''
    let admin = false

    GetAllProducts().then(products => {


        if (typeof req.session.notAuth != 'undefined')
            notAuth = req.session.notAuth
        else
            notAuth = true

        if (typeof req.session.userText != 'undefined')
            userText = req.session.userText

        if (typeof req.session.admin != 'undefined')
            admin = req.session.admin


        if (typeof req.session.userID != 'undefined')
            userID = req.session.userID

        products.forEach(p => {
            p.now = GetTimeNow()
            if (p.id_buyer[p.id_buyer.length - 1] == userID)
                p.win = true
            else
                p.win = false
        });

       products = products.reverse()

        res.render('home', { products, notAuth, userText, admin, userID })
    })


})

router.get('/about', (req, res) => {
    res.render('about', { about: 'buenas noches' })
})

router.get('/singin', (req, res) => {
    req.session.notAuth = true
    res.render('singin', { notAuth: true })
})

router.get('/login', (req, res) => {
    req.session.notAuth = true
    res.render('login', { notAuth: true })
})

router.get('/terminos-y-condiciones',(req,res)=>{
    res.render('terminos',{ notAuth: true })
})


router.use('/product', require('../product'));

router.use('/img', require('../imge'));

router.use('/user', require('../user'));


module.exports = router;
