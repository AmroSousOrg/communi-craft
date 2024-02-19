const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const User = sequelize.define(
    'User',
    {
        name: {
            type: Sequelize.STRING, 
            allowNull: false, 
            unique: true
        }, 
        password: {
            type: Sequelize.STRING,
            allowNull: false 
        },
        email: {
            type: Sequelize.STRING, 
            allowNull: false, 
            validate: { isEmail: true }
        }
    }
);

module.exports = User;