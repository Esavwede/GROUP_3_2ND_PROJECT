const User = require('../models/user.model') 
const {  hash: hashPassword } = require('../utility/password')




const { sendServerErrorResponse } = require('../helperFunctions/server_responses') 

const create = async function(req, res, next)
                {


                    try 
                    {
                        if( !req.body ) 
                        {
                            console.log("body empty ")
                            return res.status(400).json({"status":"error", "error":" request body cannot be empty"})
                        }


                        const { email, first_name, last_name, password, phone, address, is_admin  } = req.body 
                        const hashedPassword = hashPassword( password.trim() )
                        const newUser = new User(email.trim(), first_name.trim(),
                         last_name.trim(), hashedPassword, phone.trim(), address.trim(), is_admin ) 



                   // CHECK IF EMAIL TAKEN 
                   const userExists = await User.userExists(email)

                   if( !userExists )
                   {
                       return sendServerErrorResponse("Server encountered an error while creating user ",res) 
                   }

                   if( userExists.status === 400 ) 
                   {
                       return res.status(400).json({"status":"error", "error": userExists.msg })
                   }
                        


                                const newUserCreated = await User.create(newUser)

                                if( !newUserCreated )
                                {
                                    console.log(" server sent empty response for new user creation")
                                    return res.status(500).json({"status":"error", "error":" server encountered error during signup "})
                                }

                                
                                return res.status(newUserCreated.status).json({"status":"success", data: { ...newUserCreated.res } })

                    }
                    catch(err)
                    {   
                        return res.status(500).json({"status":"error", "error": err.message })
                    }
                        
                           
                }



module.exports = { create }