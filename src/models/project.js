const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const Project = sequelize.define(
    'Project',
    {
        title: {
            type: Sequelize.STRING, 
            allowNull: false
        }, 
        description: Sequelize.TEXT, 
        level: {
            type: Sequelize.ENUM, 
            values: ['Biginner', 'Intermediate', 'Advanced'],
            allowNull: false
        }, 
        finishedAt: Sequelize.DATE
    }
);

module.exports = Project;