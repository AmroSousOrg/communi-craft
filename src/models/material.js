const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const Material = sequelize.define(
    'Material',
    {
        title: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        description: Sequelize.TEXT
    }
);

module.exports = Material;