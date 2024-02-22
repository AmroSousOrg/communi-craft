/**
 * Database configuration
 *
 * initialize sequelize object, and configure connection
 * it to MySql database.
 */
const Sequelize = require("sequelize");

// configure connection
const sequelize = new Sequelize("communi_db", "aswp_team", "password12345", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});

module.exports = sequelize;
