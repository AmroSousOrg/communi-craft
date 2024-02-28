/**
 *  handling autherization errors
 */
const CustomError = require('../util/customError');
const logger = require('../config/logger');
const {
    InvalidTokenError,
    UnauthorizedError,
    InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");

const errorHandler = (err, req, res, next) => {

    let message = "";
    let status = err.status || 500;
    
    if (err instanceof CustomError) {
        message = err.message;
        status = err.status;
    }
    else if (err instanceof InsufficientScopeError) {
        message = "Permission denied";
    }
    else if (err instanceof InvalidTokenError) {
        message = "Bad credentials";
    }
    else if (err instanceof UnauthorizedError) {
        message = "Requires authentication";
    } else {
        message = "Internal Server Error";
        status = 500;
        logger.error(err.stack);
    }
    
    res.status(status).json({ message });
};

module.exports = {
    errorHandler,
};
