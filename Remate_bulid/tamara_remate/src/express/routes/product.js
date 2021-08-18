const routes = require('express').Router()
const {CreateProduct,SetBuyer,GetAllProductsFromClient,GetAllProductsWithClients}  = require('../../mongodb/Controllers/product')
const {GetTimeNow} = require('../../tools/tools')
const upload = require('../../multer/index')

routes.get('/',(req,res)=>{
  let notAuth = req.session.notAuth
  let admin = req.session.admin
  let userText = req.session.userText
  res.render('crate_product',{notAuth,admin,userText})
})


routes.post('/create',upload.array('url_img',5), (req, res) => {

  let arr_images = []

  req.files.forEach(I=> arr_images.push('img/'+I.originalname) )

   let {description, price, n_lote, intial_day, final_day} = req.body  
    CreateProduct(description, price, n_lote, arr_images, intial_day, final_day,res)
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