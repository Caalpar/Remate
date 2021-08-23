const Users = require('../../mongodb/Models/users')



const userExist = async (user = '') => {

    let u = await Users.findOne({'user':user})        
    if(u)
        throw new Error(`Ya existe un usuario con ese nombre`); 
}


module.exports = {
    userExist
}