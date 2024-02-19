const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const Skill = sequelize.define(
    'Skill',
    {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: Sequelize.TEXT
    }
);

module.exports = Skill;