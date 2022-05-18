const router = require('express').Router() 
const upload = require('../utility/multer')
const property = require('../controllers/property.controller')




module.exports = (app) =>
{

    router.post('/', upload.array('image'), property.create )
    router.patch('/:_id', property.update )
    router.patch('/:property_id/sold', property.markSold )

    app.use('/api/v1/property',router)
}


// create default for status available and admin 


