const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const Interest = sequelize.define(
    'Interest',
    {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: Sequelize.TEXT
    }
);

module.exports = Interest;