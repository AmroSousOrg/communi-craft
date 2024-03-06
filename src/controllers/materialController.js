const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");

/**
 * Add a new material.
 */
exports.addMaterial = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return next(new CustomError("Bad Request: Title and description are required", 400));
        }

        // Here we assume that there's no need for an admin check,
        // but if there is, you should include your admin middleware.
        
        const newMaterial = await models.Material.create({ title, description });
        
        res.status(201).json({
            message: "Material created successfully.",
            material: newMaterial
        });
    } catch (err) {
        next(err);
    }
};

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

/**
 * Delete a material by its ID.
 */

exports.deleteMaterial = async (req, res, next) => {
    try {
        const materialId = req.params.id;
        const material = await models.Material.findByPk(materialId);

        if (!material) {
            return next(new CustomError("Material Not Found", 404));
        }

        // Here you would also check if the user is authorized to delete the material
        // This is typically done via middleware or within the controller if the logic is simple

        await material.destroy();
        
        res.json({ message: "Material deleted successfully." });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all materials.
 */
exports.getAllMaterials = async (req, res, next) => {
    try {
        const materials = await models.Material.findAll();
        res.json(materials);
    } catch (err) {
        next(err); 
    }
};
