const express = require("express");
const userController = require('../controllers/userController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');

const router = express.Router();

/**
 *      user End-Points starts with
 *      api/users
 */

// create user account
// requires Authorization header to be set to access token
router.put('/', validateAccessToken, userController.createUser);

// get user profile info 
router.get('/:id/userInfo', userController.getUserInfo);  

// get user projects
router.get('/:id/projects', userController.getUserProjects);

// get user skills
router.get('/:id/skills', userController.getUserSkills);

// get user interests
router.get('/:id/interests', userController.getUserInterests);

// search users by query fields
router.get('/search', userController.searchUser);

// add user skill
router.post('/skills', validateAccessToken, userController.addUserSkill);

// add user interest
router.post('/interests', validateAccessToken, userController.addUserInterest);

module.exports = router;
