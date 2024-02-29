const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");

/**
 * Retrieve a material by its ID.
 */
exports.getMaterialById = async (req, res, next) => {
    try {
        const materialId = req.params.id;
        if (!materialId) {
            return next(new CustomError("Bad Request", 400));
        }

        const material = await models.Material.findByPk(materialId);
        if (!material) {
            return next(new CustomError("Material Not Found", 404));
        }

        res.json(material);
    } catch (err) {
        next(err);
    }
};

/**
 * Search for materials based on query parameters.
 */
exports.searchMaterials = async (req, res, next) => {
    try {
        const { title } = req.query;
        if (!title) {
            return next(new CustomError("Bad Request: Missing search query parameters", 400));
        }

        const materials = await models.Material.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`
                }
            }
        });

        res.json(materials);
    } catch (err) {
        next(err);
    }
};

/**
 * Update a material. This action is restricted to system administrators.
 */
exports.updateMaterial = async (req, res, next) => {
    try {
        const { id, title, description } = req.body;

        if (!id || !title || !description) {
            return next(new CustomError("Bad Request: Missing fields", 400));
        }

        const material = await models.Material.findByPk(id);
        if (!material) {
            return next(new CustomError("Material Not Found", 404));
        }

        // Assume admin check is done via middleware before this controller is called
        await material.update({ title, description });

        res.json({ message: "Material updated successfully." });
    } catch (err) {
        next(err);
    }
};

