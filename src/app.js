/**
 *  ComuniCraft main driver
 *
 *  @author __ASWP Group
 */

// global packages
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const socketIO = require("socket.io");
require("dotenv").config();

// our packages
const sequelize = require("./util/database");
const SocketManager = require("./util/socket.io");
const corsConfig = require("./config/cors");
const helmetConfig = require("./config/helmet");
const { errorHandler } = require("./middlewares/error.middleware");
const notFoundHandler = require("./middlewares/not-found.middleware");
const {
    validateAccessToken,
    checkValidAccount,
} = require("./middlewares/auth0.middleware");
// routers
const routers = require("./routes");

/**
 *
 *  Our App Configuration
 *
 */

// creating express application
const app = express();

// for parsing body of request from json format to javascript object
app.use(bodyParser.json());

// CORS middlewares
app.use(cors(corsConfig));

// Helmet configuration
app.use(helmet(helmetConfig));

// morgan: logging requests
app.use(morgan("combined"));

// instantiate socketManager to send notifications
const httpServer = http.createServer(app);
const io = socketIO(httpServer);
const socketManager = new SocketManager(io);

// Append socketManager to req variable in a middleware
const appendSocketManager = (req, res, next) => {
    req.socketManager = socketManager;
    next();
};

// routers configuration
// protected by auth middlwares
// requires user have account (except createUser)
// append socketManager to req variable
app.use(
    "/api",
    [validateAccessToken, checkValidAccount, appendSocketManager],
    routers
);

// error handlers
app.use(errorHandler);

// not found handler
app.use(notFoundHandler);

(async function () {
    try {
        // syncing sequelize connection and models associations
        // with Database. use force: true in development
        // when you need to force changes to database tables and relations.
        await sequelize.sync(/*{ force: true }*/);

        const port = process.env.PORT || 8080;
        app.listen(port); // server start listening on port {port}
    } catch (err) {
        console.log(err);
    }
})();
