const Users = require('../Models/users')
const path = require('path')
const { nanoid } = require('nanoid')
const {SendClient,SendClientRender} = require('../../tools/tools')
//const {GetAllProducts} = require('./product')

module.exports.CreateUser = (user_name,password,email,first_name,last_name,address,phone,req,res) =>
{
    Users.findOne({user:user_name},(err,user)=>{
        
        if(err) throw err

        if(!user)
        {
            const new_client =  new Users()
            new_client.user = user_name
            new_client.password = new_client.generateHash(password)
            new_client.first_name = first_name
            new_client.last_name = last_name
            new_client.address = address
            new_client.email = email
            new_client.phone = phone

            new_client.save((err,data)=>{
                if(err) throw err

                if(data)          
                {
                    let notAuth = req.session.notAuth
                    SendClientRender(res,'overlay',{message:'Bienvenido ahora puedes iniciar session',notAuth})  
                }              
            })
        }
        //else        
           // SendClient(res, { msg: "el cliente ya existe"})
    })
}

module.exports.ValidateToken = (user_name,token,req,res) => {
    Users.findOne({user:user_name,token:token},(err,user)=>{
        if(err) throw err

        if(user)    
           console.log('aca envia')
        else        
            SendClient(res, { msg: "ususario o constraseña incorrecta"})  
    })
}


module.exports.ValidateUser = (user_name,password,req,res) => {
    Users.findOne({user:user_name},(err,user)=>{
        if(err) throw err

        if(user)
        {
            
            if(user.validatePassword(password))
            {
                let token = nanoid()

                user.token = token

                user.save((err,data)=>{
                    if(err) throw err
    
                    if(data)
                    {
                        let userText = user.first_name +' '+user.last_name
                        let admin = false
                        req.session.admin
                        if(data.user == 'admin')
                            admin = true
                        
                        req.session.admin = admin
                        req.session.userText = userText
                        req.session.userID = data._id
                        req.session.notAuth = false
                        res.redirect('/');

                        
                    }
                })
            }
            else
            {
                delete req.session.admin               
                delete req.session.userText
                delete req.session.userID 
                SendClientRender(res,'error',{message:'ususario o constraseña incorrecta',notAuth:true}) 
            }           
           
        }
        else
        {
            delete req.session.admin           
            delete req.session.userText        
            delete req.session.userID 
            SendClientRender(res,'error',{message:'ususario o constraseña incorrecta',notAuth:true}) 
        }        
        
    })
}

module.exports.GetAllClientes = () =>{
    const clients = Users.find({},{__v:0,password:0,token:0}).lean().exec()
    return clients

}

module.exports.GetCliente = (id) =>{
    const client = Users.findOne({_id:id},{_id:0,__v:0}).lean().exec()
    return client

}
