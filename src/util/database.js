/**
 * Database configuration
 *
 * initialize sequelize object, and configure connection
 * it to MySql database.
 */
const Sequelize = require("sequelize");

// configure connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

module.exports = sequelize;
