
const Property = require('../models/property.model') 
const cloudinary = require('../utility/cloudinary')


const { sendServerErrorResponse } = require('../helperFunctions/server_responses')

const create = async function(req, res, next)
                {


                    try 
                    {
                        if( !req.body ) 
                        {
                            return res.status(400).json({"status":"error", "error":" property cannot be empty "})
                        }


                        console.log(' req.body ')
                        console.log( req.body )
                        console.log(' files ') 
                        console.log( req.files ) 

                        var imageUrls = [] 
                        const files = req.files 

                        for( file of files )
                        {
                            const { path } = file;
                            const newPath = await cloudinary.uploader.upload(path)
                            imageUrls.push(newPath.secure_url);
                        }

                        

                        imageUrls = JSON.stringify( imageUrls )   
                        console.log( imageUrls )                      
                        const { owner, status, price, state, city, address, type } = req.body 
                       
                    

                        const newProperty = new Property(owner , status, price , state,
                         city, address, type, imageUrls)


                        const creationResult = await Property.create(newProperty)

                        if( !creationResult )
                        {
                            return sendServerErrorResponse("Server encountered error while creating new property ad ",res) 
                        }
                        
                        // Client Error 
                        if( creationResult.status === 400 )
                        {
                            return res.status(400).json({"status":"error", "error": creationResult.msg })
                        }



                        // Created Successfully 
                        return res.status(creationResult.status).json({"status":"success", data: creationResult.res })

                    }
                    catch(err)
                    {
                        return res.status(500).json({"status":"error", "error": err.message })
                    }


                    
                }



module.exports = { create }