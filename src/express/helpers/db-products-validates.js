const Products = require('../../mongodb/Models/product')


const CheckProduct = async (id = '') => {
  
    let product = await Products.find({_id:id})
    if(!product)
        throw new Error(`El producto no existe`); 
}


module.exports = {
    CheckProduct
}
