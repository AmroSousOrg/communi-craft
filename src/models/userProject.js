const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 

const UserProject = sequelize.define(
    'UserProject',
    {
        role: {
            type: Sequelize.ENUM, 
            values: ['Admin', 'Collaborator'], 
            allowNull: false
        }
    }
);

module.exports = UserProject;