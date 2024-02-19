const Sequelize = require("sequelize");

const sequelize = require('../util/database'); 
const User = require('./user');

const Invitation = sequelize.define('Invitation');

module.exports = Invitation;