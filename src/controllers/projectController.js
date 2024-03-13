const models = require("../models");
const { Op } = require('sequelize');
const CustomError = require("../util/customError");


/**
 * Add new skills to a project.
 */
exports.addSkillsToProject = async (req, res, next) => {
    const { id } = req.params; // Project ID from the URL
    const { skill_ids } = req.body; // Array of Skill IDs from the request body
  
    try {
      // Find the project by its primary key
      const project = await models.Project.findByPk(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      await project.addSkills(skill_ids);
  
      return res.status(200).json({
        message: "Skills added to the project successfully."
      });
    } catch (error) {
      next(error);
    }
  };

  /**
 * Add new materials to a project.
 */
  exports.addMaterialsToProject = async (req, res, next) => {
    const { id } = req.params; // Project ID from URL
    const { material_id } = req.body; // Array of Material IDs from the request body
  
    try {
      // Find the project by its primary key
      const project = await models.Project.findByPk(id);
  
      // Check if the project exists
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      await project.addMaterials(material_id);
  
      res.status(200).json({
        message: "Materials added to the project successfully."
      });
    } catch (error) {
      next(error);
    }
  };

  /**
 * delete Materials From Project
 */
  exports.deleteMaterialsFromProject = async (req, res, next) => {
    const { id } = req.params; // Project ID from URL
    const { material_id } = req.body; // Array of Material IDs from the request body
  
    try {
      const project = await models.Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
        await project.removeMaterials(material_id);
  
      res.status(200).json({
        message: "Materials deleted from the project successfully."
      });
    } catch (error) {
      next(error);
    }
  };

  /**
 * delete Skills From Project
 */
  exports.deleteSkillsFromProject = async (req, res, next) => {
    const { id } = req.params; // Project ID from URL
    const { skill_id } = req.body; // Array of Skill IDs from the request body
  
    try {
      const project = await models.Project.findByPk(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
        await project.removeSkills(skill_id);
  
      res.status(200).json({
        message: "Skills removed from the project successfully."
      });
    } catch (error) {
      next(error);
    }
  };

 /**
 * get Project By Id
 */ 

 exports.getProjectById = async (req, res, next) => {
  const { id } = req.params; // Get the project ID from the URL

  try {
    const project = await models.Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};
  


