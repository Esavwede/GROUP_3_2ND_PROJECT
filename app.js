const express = require('express')
const cors = require('cors')
const app = express()



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/',(req, res, next)=>{
  res.status(200).json({"message":" Welcome to Side Hustle Internship "})
})


// API ENDPOINTS 
require('./src/routes/user.route')(app)// User 
require('./src/routes/property.route')(app)// Property 

const PORT = 3000

app.listen(PORT,()=>{
    console.log(` App listening on PORT: ${ PORT }`)
})
