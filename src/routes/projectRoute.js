const { Router } = require("express");
const { validateAccessToken } = require("../middlewares/auth0.middleware");
const projectController = require("../controllers/projectController");
const router = Router();

/**
 *      Router End-Points starts with
 *      /api/projects
 */

//TODO: routes between project and user

// a route that help a user to create a project and add himeself as an admin
router.post("/", validateAccessToken, projectController.createProject);

// a route that help a user to get all projects that he is a member of [admin or collaborator]
router.get("/:id", validateAccessToken, projectController.getUserProjects);

// a route that help a user to update a project that he is an admin of
router.put("/:id", validateAccessToken, projectController.updateProject);

// a route that help a user to delete a project that he is an admin of
router.delete("/:id", validateAccessToken, projectController.deleteProject);

module.exports = router;

// routes between project,inviatation and user
// routes between project and material
// routes between project and skill
