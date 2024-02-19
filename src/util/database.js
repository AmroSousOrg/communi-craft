const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'communi_db',
    'aswp_team', 
    'password12345', 
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;