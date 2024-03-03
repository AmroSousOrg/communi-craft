const express = require("express");
const userController = require("../controllers/invitationsController");
const { validateAccessToken } = require("../middlewares/auth0.middleware");

const router = express.Router();

/**
 * GET
 */
// router.get(
//     "/:id/invitations/sent",
//     validateAccessToken,
//     userController.getInvitationsSent
// );
// router.get(
//     "/:id/invitations/received",
//     validateAccessToken,
//     userController.getInvitationsReceived
// );

/**
 * POST, PUT
 */

/**
 * DELETE
 */

module.exports = router;