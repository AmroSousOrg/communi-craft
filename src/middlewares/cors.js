// cors middleware
module.exports = (req, res, next) => {
    // allow access from all origins
    res.setHeader("Access-Control-Allow-Origin", "*");
    // allow http methods
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PATCH, DELETE, PUT"
    );
    // allow http headers
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
};
