/**
 * CustomError, extends Error class, to create Error with custom message 
 * and status code, to return it to error handling middleware like: next(new CustomError("", XXX));
 */
module.exports = class CustomError extends Error {
    constructor(message, statusCode) {
        super(message); 
        this.status = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
};