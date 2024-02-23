const { User } = require("../models");
/**
 * function to get user profile information
 * from database by id
 */
exports.getUser = async function getUser(req, res, next) {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            const err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        const { password, ...result } = user.dataValues;
        res.json(result);
    } catch (err) {
        next(err);
    }
};
