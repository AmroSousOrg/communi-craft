const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const Project = sequelize.define(
    'Project',
    {
        title: {
            type: Sequelize.STRING, 
            allowNull: false
        }, 
        description: {
            type: Sequelize.TEXT,
        },
        isPublic: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        level: {
            type: Sequelize.ENUM, 
            values: ['Beginner', 'Intermediate', 'Advanced'],
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM,
            values: ['PLANNING', 'PROGRESS', 'FINISHED'],
            defaultValue: 'PLANNING',
        },
        location: {
            type: Sequelize.STRING,
        }
    }
);

module.exports = Project;