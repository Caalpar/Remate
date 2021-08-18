const Users = require('../../mongodb/Models/users')



const userExist = async (user = '') => {


    Users.findOne({})

    if(intial_day > final_day)
        throw new Error(`La Fecha inicial no puede ser superior a la fecha final`); 
}


module.exports = {
    CheckDate
}