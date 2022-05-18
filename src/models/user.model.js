const db = require('../config/db.config') 
const { generate: generateToken } = require('../utility/token')
const { compare: comparePassword, hash: hashPassword } = require('../utility/password')


class User 
{
    constructor( email, first_name, last_name, password, phone, address, is_admin)
    {
        this.email = email 
        this.first_name = first_name
        this.last_name = last_name 
        this.password = password
        this.phone = phone 
        this.address = address 
        this.is_admin = is_admin 
    }


    // Check if user exists 
    static async userExists( email )
    {

        return new Promise(async (resolve, reject)=>{ 

                const query = ` SELECT email FROM users WHERE email = ? `
                const queryValues = [email]
                // Check if Email Exists
                    await db.query(query,queryValues,(err, res )=>
                    {

                                    if(err)
                                    {
                                        return reject(new Error(" Server encountered error during signpu "))
                                    }

                                    
                                    // User Exists 
                                    if( res.length ) 
                                    {
                                        console.log('----- User exists ')
                                        return resolve({ status: 400, msg:" Email taken "}) 
                                    }
                                
                                    return resolve({ status: 200 })
                    })


        })

    }


    // Encrypt Password for storage, create a token and store with new user 
    static async create( newUser)
            {

                return new Promise( async(resolve, reject)=>
                {


                    const { email, first_name, last_name, password, phone, address, is_admin } = newUser 
                    const query = ` INSERT INTO users(email, first_name, last_name, password, phone, address, is_admin ) VALUES(?,?,?,?,?,?,?)`
                    const queryValues = [ email, first_name, last_name, password, phone, address, is_admin]
                
                    // Insert New User 
                    await db.query(query,queryValues,(err, res)=>
                    {
    
                        if( err )
                        {
                            console.log(err) 
                            return reject(new Error(" Server encountered error while signing new user "))
                        } 
    
                        const newUserData = {  id: res.insertId , first_name: newUser.first_name, 
                                               last_name: newUser.last_name, email: newUser.email }
                      
                        const token = generateToken(res.insertId);
                        console.log(" user created ")
                        return resolve({ status: 201, res:{ token, ...newUserData }})
                    }
                    )


                })
            }



    static login(userData)
    {
        
        return new Promise(async(resolve, reject)=>
        {

            var { email, password } = userData 
            
            const query = ` SELECT id, first_name, last_name, email, password FROM users WHERE email = ?`
            const queryValues = [ email]

           await db.query(query,queryValues, (err, res) => {

                if (err) {
                    console.log(err) 
                    return reject(new Error("Server encountered error during login"))
                }

                console.dir(res) 
                
                if (!res.length) {
                    return resolve({ "status": 400, "msg": " user with email not found " })
                }

                const hashedPassword = res[0].password 
       
                // check password 
                if( comparePassword( password, hashedPassword ) )
                {
                    const token = generateToken( res[0].id )
                    return resolve({ "status": 200, res: { token, ...res[0] } })
                }
             
                    return reject({"status": 400, res:" incorrect password "})
            })

        }) 

    }


}





module.exports = User