const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");

/**
 * Add a new interest.
 */
exports.createInterest = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return next(new CustomError("Bad Request: Name is required", 400));
        }
        const newInterest = await models.Interest.create({
            title,
            description: description || '' 
        });
        
        res.status(201).json({
            message: "Interest created successfully.",
            interest: newInterest
        });
    } catch (err) {
        next(err);
    }
};

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
        const { title } = req.query;
        if (!title) {
            return next(new CustomError("Bad Request: Missing search query parameters", 400));
        }

        const interests = await models.Interest.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`
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
        const { id, title, description } = req.body;

        if (!id || !title || !description) {
            return next(new CustomError("Bad Request: Missing fields", 400));
        }

        const interest = await models.Interest.findByPk(id);
        if (!interest) {
            return next(new CustomError("Interest Not Found", 404));
        }
        await interest.update({ title, description });

        res.json({ message: "Interest updated successfully." });
    } catch (err) {
        next(err);
    }
};

/**
 * Delete an interest by its ID.
 */
exports.deleteInterest = async (req, res, next) => {
    try {
        const interestIdi = req.params.id;
        const interest = await models.Interest.findByPk(interestIdi);

        if (!interest) {
            return next(new CustomError("Interest Not Found", 404));
        }
        await interest.destroy();
        
        res.json({ message: "Interest deleted successfully." });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all interests.
 */
exports.getAllInterests = async (req, res, next) => {
    try {
        const interests = await models.Interest.findAll();

        res.json(interests);
    } catch (err) {
        next(err);
    }
};



