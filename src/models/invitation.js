const Sequelize = require("sequelize");

const sequelize = require("../util/database");
const User = require("./user");

const Invitation = sequelize.define("Invitation", {
    status: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'REJECTED', 'ACCEPTED'],
        defaultValue: 'PENDING'
    }
});

module.exports = Invitation;
