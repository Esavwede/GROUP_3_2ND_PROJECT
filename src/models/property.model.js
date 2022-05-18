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


    static async update(propertyBody,_id)
    {
        return new Promise((resolve, reject)=>
        {

            const query = ` UPDATE properties SET ?  WHERE id = ?`
            const queryValues =  [propertyBody, _id]


            db.query(query, queryValues, async (err, res )=>
             {

                if( err )
                {
                    console.log( err )
                    return reject( new Error(" Error occured while updating property ad"))
                }
                

                 const id = res.insertId  
                 const query2 = ` SELECT id, status, type, state, city, address, price, created_on, imageUrls FROM properties WHERE id = ? `
                 const query2Values = [_id]

                 await db.query(query2,query2Values,(err, res)=>
                 {

                    if( err )
                    {
                        console.log(err)
                        return reject( new Error("Server encountered error while updating ad "))
                    }

            
                    return resolve({ updated: true, status: 200, res: { id, ...res[0] }  })

                 })
             })

        })        
    }


    static async markSold(propertyId)
    {
        return new Promise(async (resolve, reject)=>{ 

            await db.query(` UPDATE properties SET status = ? where id = ? `,
            ['sold',propertyId],
            async (err)=>{


                if( err )
                {
                    console.log(err) 
                    return reject(new Error(" Error occured while marking property as sold "))
                }


                await db.query(` SELECT id, status, type, state, city, address, price, 
                created_on, imageUrls  FROM properties WHERE id = ? `,
                [propertyId],
                (err, res)=>{

                    if(err) 
                    {
                        console.log(err) 
                       return reject( new Error(" Error occured while marking property as sold "))
                    }

                    console.log(` Property marked as sold`)
                    console.log(res) 
                    const data = {}
                   return resolve({ updated: true, status: 200, res:{ ...res[0] } })
                })
            }
            )

        })
    }


    static async delete(property_id)
    {
        return new Promise(async (resolve, reject)=>{

            db.query(` SELECT id, status, type, state, city, address, price, created_on, imageUrls FROM properties WHERE id = ?`,
                    [property_id],
                    async (err, res)=>{

                        if( err )
                        {
                            console.log(err) 
                            return reject(new Error(" Error occured while deleting property"))
                        }

                        const deletedProperty = res[0] 

                        db.query(` DELETE FROM properties WHERE id = ? `,
                        [property_id],
                        async (err, res)=>{
            
                            if( err )
                            {
                                return reject(new Error("Error occured while deleting property"))
                            }
            
                            console.log(` Property deleted`)
                            console.log(res)
                            resolve({ deleted: true, status: 200, res: deletedProperty })
                        })


                    })
         
        })
    }
    

    static async viewAll()
    {
        return new Promise((resolve, reject)=>{

            db.query(` SELECT * FROM properties WHERE status = ? `,
            ['available'],
            (err, res)=>{

                if( err )
                {
                    return reject( new Error(("Server encountered error while getting a properties ")) ) 
                }

             
                console.log(res) 
                resolve({status: 200, res })
            })
        })
    }
    // ENd 

}



module.exports =  Property 
 