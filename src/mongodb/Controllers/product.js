const Products = require('../Models/product')
const path = require('path')

const {GetAllClientes} = require('./users')

const { SendClient,SendClientRender,GetTime } = require('../../tools/tools')
                        

module.exports.CreateProduct = (description, price, n_lote, url_img, intial_day, final_day, res) => {
    Products.findOne({ n_lote: n_lote }, (err, product) => {

        if (err) throw err

        if (!product) {

            let _price={open:0,close:price}
           
            const new_product = new Products()
            new_product.description = description
            new_product.price = _price
            new_product.n_lote = n_lote
            new_product.url_img = url_img
            new_product.intial_day = intial_day.toString()
            new_product.final_day = final_day.toString()
            new_product.id_buyer = ''
            new_product.offers = 0
            console.log('hola')
            new_product.save((err, data) => {
                if (err) throw err

                if (data)
                    res.redirect('/')//SendClient(res, { msg: "el producto fue creado correctamente" })
            })
        }
        else
            console.log("el producto ya existe")
            //SendClient(res, { msg: "el producto ya existe" })
    })
}


module.exports.SetFinished = (id,res)=>
{
    Products.findOne({ _id: id }, (err, product) => {
        if(product)
        {
            if(product.final_day<Date.now())
            {
                product.finished = true

                product.save((err, data) => {
                    if(data)
                        console.log(data)
                        //SendClient(res, { msg: "el remate de este producto a finalizado" })

                })
            }
            else
            console.log("el remate de este producto aun no a finalizado")
           // SendClient(res, { msg: "el remate de este producto aun no a finalizado" })
        }
    })
}




module.exports.SetBuyer = (id,id_buyer,offers_price,res)=>
{
    Products.findOne({ _id: id }, (err, product) => {
        if(product)
        {
                if(product.offers>0)
                {
                    if(offers_price>=product.price.close+50) // cambiar 50 por una variable
                    {
                        let _lastPrice = product.price.close
                        let _price={open:_lastPrice,close:offers_price}
        
                        product.price= _price
                        product.id_buyer.push(id_buyer)
                        product.offers +=1
                        product.save((err, data) => {
                            if(data)
                                res.redirect('/product/get-buyer-products')  
                            // SendClient(res, { msg: "se ah agregardo el comprador al producto" })
        
                        })
                    }
                    else
                    {
                        SendClientRender(res,'overlay',{message:'puede pujar como minimo $50 sobre el precio actual'})  
                    }
                }  
               else
               {
                    let _lastPrice = product.price.close
                    let _price={open:_lastPrice,close:offers_price}

                    product.price= _price
                    product.id_buyer = id_buyer
                    product.offers +=1
                    product.save((err, data) => {
                        if(data)
                            res.redirect('/')  
                        // SendClient(res, { msg: "se ah agregardo el comprador al producto" })

                    })
               }
        }
        else
        console.log("no se ha encontrado el producto" ) 
        //SendClient(res, { msg: "no se ha encontrado el producto" })
    })
}


module.exports.GetProduct = (id) =>
{
    const product = Products.findOne({_id:id},{_id:0,__v:0}).exec()
    return product
}

module.exports.GetAllProducts = () =>
{
    const products = Products.find({},{__v:0}).lean().exec()
    return products
}

module.exports.GetAllProductsWithClients = (req,res) =>
{
    Products.find({}, (err, products) => {

        if(err) throw err

        GetAllClientes().then(clients=>{
            if(products){

                let product_and_client = []

                products.forEach(p => {

                    let index_client 

                    index_client = clients.findIndex(c=>c._id==p.id_buyer[p.id_buyer.length-1])

                    // el producto tiene un pujador
                    if(index_client!=-1)
                    {
                       let c =  clients[index_client]    

                        let data = {
                            client: c,
                            product: p,
                            active: true,
                        }
                        product_and_client.push(data)

                    }
                    //el producto no tiene pujador
                    else
                    {
                         

                        let data = {
                            client: null,
                            product: p,
                            active: false,
                        }
                        product_and_client.push(data)
                    }

                });
                
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


                res.render('myauctions',{product_and_client,notAuth,userText,userID,admin})
            }
        })
    }).lean()
}

module.exports.GetAllProductsFromClient = (id_buyers) =>
{
    const products = Products.find({id_buyer:id_buyers},{__v:0}).lean().exec()
    return products
}
