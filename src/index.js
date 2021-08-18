const monggose = require('mongoose')
require('./express/express')
const {urlconnect} = require('./mongodb/config')
const {CreateUser} = require('./mongodb/Controllers/users')



monggose.connect(urlconnect,{ useNewUrlParser: true, useUnifiedTopology: true },(err,data)=>{
    if(err){
        console.log("error connecting to DB")
    }
    if(data){
        console.log("connected to DB");
    }}
  )
  

  CreateUser('admin','admin','tamaraacostaremates@gmail.com','Tamara','Acosta',098246159)

 
  
  //user_name,password,email,first_name,last_name,address,phone