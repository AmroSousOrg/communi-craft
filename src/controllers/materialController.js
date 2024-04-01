const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");
const handleNotFoundError=(entity,next) => {
    return next(new CustomError(`${entity} Not Found`,404));
};

/**
 * Add a new material.
 */
exports.addMaterial = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return next(new CustomError("Bad Request: Title and description are required", 400));
        }
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
 * Search for materials based on query parameters.
 */
exports.searchMaterials = async (req, res, next) => {
    try {
        const {title,description}=req.query;
        const searchtitle=(title&&title.length)?title:null;
        const searchdescription=(description&&description.length)?description:null;

        const searchWhere={};

        if(searchtitle){
            searchWhere.title={[Op.like]:'%'+searchtitle.toLowerCase()+'%'};
        }
        
        if(searchdescription){
            searchWhere.description={[Op.like]:'%'+searchdescription.toLowerCase()+'%'};
        }
        const result=await models.Material.findAll({
            where:searchWhere
        });

        if(!result.length)return handleNotFoundError("material",next)

        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

/**
 * Update a material. 
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
