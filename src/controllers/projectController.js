const Project = require("../models/Project");
const User = require("../models/User");
const UserProject = require("../models/UserProject");
const CustomError = require("../util/customError");

// Create a project and add the user as an admin
const createProject = async (req, res, next) => {
  try {
    const userId = req.auth.payload.sub;
    const user = await User.findByPk(userId);
    console.log("🚀 ~ createProject ~ user:", user);
    const { name, description, title, level } = req.body;

    // Create the project
    const project = await Project.create({
      name,
      description,
      title,
      level,
    });

    // await user.addProjects(project);

    // // Add the user as an admin
    // await user.addProject(project, {
    //   through: { role: "admin" },
    // });

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.log("🚀 ~ createProject ~ error:", error);
    next(error);
  }
};

// Get all projects that the user is a member of (admin or collaborator)
const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all projects where the user is a member
    const projects = await Project.findAll({
      include: [
        {
          association: "admins",
          where: { id: userId },
        },
        {
          association: "collaborators",
          where: { id: userId },
        },
      ],
    });

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Update a project that the user is an admin of
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    // Find the project
    const project = await Project.findOne({
      where: { id },
      include: [{ association: "admins", where: { id: userId } }],
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    // Update the project
    await project.update({ name, description });

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Delete a project that the user is an admin of
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the project
    const project = await Project.findOne({
      where: { id },
      include: [{ association: "admins", where: { id: userId } }],
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    // Delete the project
    await project.destroy();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
};
