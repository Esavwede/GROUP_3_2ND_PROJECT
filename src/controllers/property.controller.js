
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

                
const update = async function(req, res, next)
{
    try
    {


        if( !req.body )
        {
            return res.status(400).json({"status":"error", "error":"cannot update with an empty body "})
        }

        const property_id = req.params._id  
        const propertyUpdated = await Property.update(req.body,property_id)

        
        if( !propertyUpdated )
        {
            return sendServerErrorResponse(" server encountered error while updating property ",res)
        }
    
            return res.status(200).json({"status":"success", data: propertyUpdated.res  })
        


    }catch(err){
        return res.status(500).json({"status":"error", "error": err.message })
    }
}



const markSold = async function(req, res, next)
                        {

                            try
                            {

                                const property_id = req.params.property_id 
                                const markSoldResult = await Property.markSold(property_id) 

                                if( !markSoldResult ) 
                                {
                                    return sendServerErrorResponse("Server encountered error while marking property as sold ",res)
                                }

                                return res.status(200).json({"status":"success", data: markSoldResult.res  })

                            }
                            catch(err)
                            {
                                return res.status(500).json({"status":"error", "error": err.message })
                            }

                        }



                        const deleteProperty = async function(req, res, next)
                        {
                            try
                            {
                                const property_id = req.params.property_id 
                                const deleteResult = await Property.delete(property_id) 

                                if( !deleteResult ) 
                                {
                                    return sendServerErrorResponse("Server encountered error while deleting property ",res)
                                }

                                return res.status(200).json({"status":"success", data: deleteResult.res  })

                            }
                            catch(err)
                            {
                                return res.status(500).json({"status":"error", "error": err.message })
                            }
                        }

                        
const viewAll = async function(req, res, next)
{

    try
    {
        const propertiesResult = await Property.viewAll() 

        if( !propertiesResult ) 
        {
            return sendServerErrorResponse("Server encountered error while getting a properties ",err)
        }

        return res.status(200).json({"status":"success", data: propertiesResult.res  })

    }
    catch(err)
    {
        return res.status(500).json({"status":"error", "error": err.message })
    }

}


module.exports = { create, update, markSold, deleteProperty, viewAll }