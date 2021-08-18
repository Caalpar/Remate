const routes = require('express').Router()
const {tools} = require('../../tools/tools')

routes.get('/:name',(req,res)=>{
    let name =  req.params.name 
    res.sendFile(process.cwd()+'/src/assets/imgs/'+name)
})




module.exports = routes;