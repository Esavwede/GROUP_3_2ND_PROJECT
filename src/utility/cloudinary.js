const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: 'fibrelearn',
  api_key: '218556559236395',
  api_secret: '1fJdAmfVZ5J49WhJNO5WXI12ENk',
});


module.exports = cloudinary;
