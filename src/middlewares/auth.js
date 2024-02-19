const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        const user = await User.findByPk(1);
        req.user = user;
        console.log(req.user);
    } catch (err) {
        console.log(err);
    }
};