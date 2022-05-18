const db = require('../config/db.config') 



class Property
{
    constructor(owner,  status, price, state, city, address, type, imageUrls)
    {
        this.owner = owner 
        this.status = status
        this.price = price 
        this.state = state 
        this.city = city 
        this.address = address 
        this.type = type 
        this.imageUrls = imageUrls
    }


    static async create(newProperty)
    {
        
        return new Promise((resolve, reject)=>
        {


            const { owner, price, state, city, address, type, imageUrls } = newProperty
                console.log(" Image Url s OG " + imageUrls )
                const query = ` INSERT INTO properties(owner, price, state, city, address, type, imageUrls) VALUES(?,?,?,?,?,?,?) `
                const queryValues =  [owner, price, state, city, address, type, imageUrls]


            db.query(query,queryValues,(err, res)=>
            {       

                if( err )
                {
                    console.log(err)
                    return reject(new Error(" Server encountered error while creating new property "))
                }

                    const data = { data:{ id: res.insertId, status: 'available', 
                    type, state, city, address,
                    price, created_on: new Date(), imageUrls } }

                    return resolve({ status: 201, res:{ ...data }})

            }
            )

        })
    }



}



module.exports =  Property 
 