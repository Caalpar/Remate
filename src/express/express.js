let express = require('express')
let handel = require('express-handlebars')
let path = require('path')
const session = require('express-session')

let routes = require('./routes/index/index')
let app = express()
let port = 30000

let hbs = handel.create({
  defaultLayout:'main',
  layoutsDir:path.join(__dirname,'../../views/layouts'),
  partialsDir:path.join(__dirname,'../../views/partials'),
  extname:'.hbs',

  helpers:{
    sumOne: function (value){
      return parseInt(value)+1
    }
  }

})

app.set('views',path.join(__dirname,'../../views'));
app.engine('.hbs',hbs.engine)
app.set('view engine','.hbs')


app.use(session({
  secret:'s3cr3t0',
  resave:false,
  saveUninitialized:false,
}))
app.use(express.json(), express.text())
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.static('public'))

app.use('/', routes)


let server = app.listen(port, '0.0.0.0', () =>
  console.log(`Express successfully connected to port ${port}`)
)

