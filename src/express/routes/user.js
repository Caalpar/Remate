const routes = require('express').Router()

const {ValidateUser,ValidateToken,CreateUser} = require('../../mongodb/Controllers/users')


const {CheckDate} = require('../helpers/db-products-validates')
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');

//VALIDACIONES

 const productosValidator = [
   check('description').custom((c,{req})=>CheckDate(req.body.intial_day,req.body.final_day)), 
   validarCampos
 ]



routes.post('/singin', (req, res) => {
  let {user,password,email,first_name,last_name,address,phone} = req.body   
  CreateUser(user,password,email,first_name,last_name,address,phone,req,res) 
})


routes.post('/login', (req, res) => {
    let {user,password} = req.body   
    ValidateUser(user,password,req,res) 
})

routes.get('/approved:user',(req,res)=>{
    let user =  req.params.user.split('&')
    ValidateToken(user[0],user[1],req,res)
})

routes.get('/logoff',(req,res)=>{
  delete req.session.notAuth 
  delete req.session.userText
  delete req.session.admin
  delete req.session.userID
  res.redirect('/')
})

routes.all('*', (req, res) => {
  res.status(404).send(`Sorry, we could not find ${req.originalUrl}!`)
})

module.exports = routes
