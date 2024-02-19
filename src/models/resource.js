const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const Resource = sequelize.define(
    'Resource',
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: Sequelize.TEXT,
        price: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: { min: 0 }
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: { min: 0 }
        }
    }
);

module.exports = Resource;