/**
 *  handling autherization errors
 */
const {
    InvalidTokenError,
    UnauthorizedError,
    InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");

const errorHandler = (err, req, res, next) => {

    let message = err.message || "Internal Server Error";
    let status = err.status || 500;

    if (err instanceof InsufficientScopeError) {
        message = "Permission denied";
    }
    else if (err instanceof InvalidTokenError) {
        message = "Bad credentials";
    }
    else if (err instanceof UnauthorizedError) {
        message = "Requires authentication";
    }

    res.status(status).json({ message });
};

module.exports = {
    errorHandler,
};
