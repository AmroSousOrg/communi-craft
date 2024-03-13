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
router.get("/:name/invitations/sent", userController.getUserInvitationsSent);
router.get("/:name/invitations/received", userController.getUserInvitationsReceived);
router.get("/search", userController.searchUser);

/**
 * PUT
*/
router.put("/", userController.createUser);
router.put("/:name/invitations/sent", userController.sendInvitation);

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
router.delete("/:name/invitations/sent/:inv_id", userController.deleteSentInvitation);

module.exports = router;
