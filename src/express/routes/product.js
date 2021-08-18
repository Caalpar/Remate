const routes = require('express').Router()
const {CreateProduct,SetBuyer,GetAllProductsFromClient,GetAllProductsWithClients}  = require('../../mongodb/Controllers/product')
const {GetTimeNow,SendError} = require('../../tools/tools')
const upload = require('../../multer/index')

const {CheckDate} = require('../helpers/db-products-validates')
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');

//VALIDACIONES

// const productosValidator = [
//   check('description').custom((c,{req})=>CheckDate(req.body.intial_day,req.body.final_day)), 
//   validarCampos
// ]


// RUTAS
routes.get('/',(req,res)=>{

  let notAuth = req.session.notAuth
  let admin = req.session.admin
  let userText = req.session.userText

  if(notAuth || !admin)  
    res.redirect('/')
  else
    res.render('crate_product',{notAuth,admin,userText})
})


routes.post('/create', upload.array('url_img',5), (req, res) => {

  let arr_images = []

  
  let {description, price, n_lote, intial_day, final_day} = req.body  

  console.log('intial_day:'+intial_day)

  let ini_date = new Date(intial_day)
  let fin_date = new Date(final_day)


  if(!intial_day)
  SendError(res,'debe ingresar una fecha de inicio')
  else if(!final_day)
  SendError(res,'debe ingresar una fecha de fin')
  else if(ini_date.getTime()>fin_date.getTime())
  SendError(res,'la fecha de inicio no puede ser superior a la fecha de fin')
  else if(!description)
  SendError(res,'la descripcion es obligatoria')
  else if(!price)
  SendError(res,'el precio es obligatorio')
  else if(parseInt(price) == NaN)
  SendError(res,'el precio tiene que ser numerico')
  else if(!n_lote)
  SendError(res,'el número de lote es obligatorio')
  else if(parseInt(n_lote) == NaN)
  SendError(res,'el número de lote tiene que ser numerico')
  else if(req.files.length == 0)
  SendError(res,'debe ingresar al menos una foto')
  else
  {
      req.files.forEach(I=> arr_images.push('img/'+I.originalname) )
      CreateProduct(description, price, n_lote, arr_images, intial_day, final_day,res)
  }
})

routes.post('/set-finished', (req, res) => {
  let {id} = req.body   
  SetFinished(id,res)
})

routes.post('/set-buyer', (req, res) => {
  let {id,id_buyer,offers_price} = req.body   
  SetBuyer(id,id_buyer,offers_price,res)
})

routes.get('/get-all-products-with-clints',(req,res)=>{
     GetAllProductsWithClients(req,res)
})

routes.get('/get-buyer-products', (req, res) => {

  let notAuth 
  let userText = ''
  let userID = ''
  let admin = false

  if (typeof req.session.userID != 'undefined')
  userID = req.session.userID

  if (typeof req.session.notAuth != 'undefined')
  notAuth = req.session.notAuth
  else
  notAuth = true

  if (typeof req.session.userText != 'undefined')
  userText = req.session.userText

  if (typeof req.session.admin != 'undefined')
  admin = req.session.admin


  GetAllProductsFromClient(userID).then(products=>{
    products.forEach(p => {
      p.now = GetTimeNow()

      if(p.id_buyer[p.id_buyer.length-1]==userID)
      p.win = true
      else
      p.win = false

  });

  res.render('mybids',{notAuth,userID,admin,userText,products})

  })
})


routes.get('/img/:name',(req,res)=>{
  let name =  req.params.name
  res.sendFile(process.cwd()+'/src/assets/imgs/'+name)
})



routes.all('*', (req, res) => {
  res.status(404).send(`Sorry, we could not find ${req.originalUrl}!`)
})

module.exports = routes