const express = require("express");
const userController = require("../controllers/userController");
const { validateAccessToken } = require("../middlewares/auth0.middleware");

const router = express.Router();

// {Base URL} = /api/users/

/**
 * USER account
 */
router.put("/", validateAccessToken, userController.createUser);
router.get("/:id/userInfo", userController.getUserInfo);

/**
 * GET
 */
router.get("/:id/projects", userController.getUserProjects);
router.get("/:id/skills", userController.getUserSkills);
router.get("/:id/interests", userController.getUserInterests);
// router.get("/:id/resources", userController.getUserResources);

/**
 * PUT, POST
 */
router.post("/skills", validateAccessToken, userController.addUserSkill);
router.post("/interests", validateAccessToken, userController.addUserInterest);

/**
 * DELETE
 */

/**
 * SEARCH
 */
router.get("/search", userController.searchUser);

module.exports = router;
