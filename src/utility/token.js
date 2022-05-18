const jwt = require('jsonwebtoken');
//const { logger } = require('./logger');
const JWT_SECRET_KEY = 'secret' 

const generate = (id) => jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: '1d'});

const decode = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch (error) {
       //  logger.error(error);
       console.log(error)
    }
};

module.exports = {
    generate,
    decode
}