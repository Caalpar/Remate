const mongoose = require('mongoose');


const userProducts = new mongoose.Schema({       
    description:String,
    price:{open:Number,close:Number},
    n_lote:Number,
    url_img:[String],
    intial_day:String,
    final_day:String,
    id_buyer:[String],
    finished:Boolean,
    offers:Number,

});

module.exports = mongoose.model('Products',userProducts,'productsCollection');