const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");

/**
 * Retrieve an interest by its ID.
 */
exports.getInterestById = async (req, res, next) => {
    try {
        const interestId = req.params.id;
        if (!interestId) {
            return next(new CustomError("Bad Request", 400));
        }

        const interest = await models.Interest.findByPk(interestId);
        if (!interest) {
            return next(new CustomError("Interest Not Found", 404));
        }

        res.json(interest);
    } catch (err) {
        next(err);
    }
};

/**
 * Search for interests based on query parameters.
 */
exports.searchInterests = async (req, res, next) => {
    try {
        const { name } = req.query;
        if (!name) {
            return next(new CustomError("Bad Request: Missing search query parameters", 400));
        }

        const interests = await models.Interest.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            }
        });

        res.json(interests);
    } catch (err) {
        next(err);
    }
};

/**
 * Update an interest. This action is restricted to system administrators.
 */
exports.updateInterest = async (req, res, next) => {
    try {
        const { id, name, description } = req.body;

        if (!id || !name || !description) {
            return next(new CustomError("Bad Request: Missing fields", 400));
        }

        const interest = await models.Interest.findByPk(id);
        if (!interest) {
            return next(new CustomError("Interest Not Found", 404));
        }

        // Assume admin check is done via middleware before this controller is called
        await interest.update({ name, description });

        res.json({ message: "Interest updated successfully." });
    } catch (err) {
        next(err);
    }
};

