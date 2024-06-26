const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const User = sequelize.define(
    'User',
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING, 
            allowNull: false, 
            unique: true
        }, 
        email: {
            type: Sequelize.STRING, 
            allowNull: false, 
            validate: { isEmail: true }
        }
    }
);

module.exports = User;