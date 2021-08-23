const routes = require('express').Router()

const {ValidateUser,ValidateToken,CreateUser} = require('../../mongodb/Controllers/users')


const {userExist} = require('../helpers/db-user-validates')
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');

//VALIDACIONES

 const userSingInValidator = [
  check('user','el campo usuario no puede estar vacio').not().isEmpty(), 
  check('password','el campo contraseña no puede estar vacio').not().isEmpty(), 
  check('first_name','el campo nombre no puede estar vacio').not().isEmpty(), 
  check('last_name','el campo apellido no puede estar vacio').not().isEmpty(), 
  check('address','el campo dirección no puede estar vacio').not().isEmpty(), 
  check('phone','el campo dirección no puede estar vacio').not().isEmpty(), 
   check('user','el usuario ya existe').custom(userExist), 
   check('password','es obligatorio colocar un contraseña').isString(), 
   check('first_name','es obligatorio colocar el nombre').isString(), 
   check('last_name','es obligatorio colocar el apellido').isString(), 
   check('address','es obligatorio colocar la direccion').isString(), 
   check('phone','es obligatorio colocar un telefono con formato numerico').isNumeric(), 
   validarCampos
 ]



routes.post('/singin',userSingInValidator, (req, res) => {
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
