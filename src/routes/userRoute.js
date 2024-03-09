const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// {Base URL} = /api/users/

/**
 * GET
*/
router.get("/:name/userInfo", userController.getUserInfo);
router.get("/:name/projects", userController.getUserProjects);
router.get("/:name/skills", userController.getUserSkills);
router.get("/:name/interests", userController.getUserInterests);
router.get("/:name/resources", userController.getUserResources);
router.get("/:name/invitations", userController.getUserInvitations);
router.get("/search", userController.searchUser);

/**
 * PUT
*/
router.put("/", userController.createUser);

/**
 * POST
*/
router.post("/:name/skills", userController.addUserSkill);
router.post("/:name/interests", userController.addUserInterest);
router.post("/:name/invitations/:id", userController.respondeInvitation);
router.post("/:name/userinfo", userController.updateUserProfile);

/**
 * DELETE
 */
router.delete("/:name/skills", userController.deleteUserSkills);
router.delete("/:name/interests", userController.deleteUserInterests);

module.exports = router;
