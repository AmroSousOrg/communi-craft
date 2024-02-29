/**
 *  ComuniCraft main driver
 *
 *  @author __ASWP Group
 */

// global packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// our packages
const sequelize = require("./util/database");
const corsConfig = require("./config/cors");
const helmetConfig = require("./config/helmet");
const { errorHandler } = require("./middlewares/error.middleware");
const notFoundHandler = require("./middlewares/not-found.middleware");
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

// routers configuration
app.use("/api", routers);

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
