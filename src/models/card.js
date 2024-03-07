const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const Card = sequelize.define(
    'Card',
    {
        subject: {
            type: Sequelize.STRING,
            allowNull: false
        },
        details: {
            type: Sequelize.TEXT, 
            allowNull: false
        },
        due_date: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.ENUM,
            values: ['TODO', 'PROGRESS', 'BLOCKED', 'REVIEW', 'COMPLETED'],
            defaultValue: 'TODO'
        }
    }
);

module.exports = Card;