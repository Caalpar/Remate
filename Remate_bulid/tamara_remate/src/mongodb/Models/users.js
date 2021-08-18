const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({       
    user:String,
    password:String,
    email: String,
    first_name:String,
    last_name:String,
    address:String,
    phone:String,
    token:String
});

userSchema.methods.generateHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};



userSchema.methods.validatePassword = function(pass){
    return bcrypt.compareSync(pass,this.password);
}


module.exports = mongoose.model('Users',userSchema,'userCollection');