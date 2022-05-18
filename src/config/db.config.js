

const mysql = require('mysql')


const connection = mysql.createConnection
(
              {
                host:"localhost",
                user:"root",
                password:"password",
                database:"apexhaux"
              }
)



connection.connect((err)=>{

  if(err) throw err
  console.log("database connected successfully ")
})



module.exports =  connection 
