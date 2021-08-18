const Products = require('../../mongodb/Models/product')


const CheckDate = (intial_day,final_day) => {

    console.log(intial_day)
    if(intial_day > final_day)
        throw new Error(`La Fecha inicial no puede ser superior a la fecha final`); 
}


module.exports = {
    CheckDate
}
