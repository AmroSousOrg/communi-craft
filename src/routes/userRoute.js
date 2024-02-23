const { Router } = require("express");
const userController = require('../controllers/userController');
const router = Router();

/**
 *      Router End-Points starts with
 *      api/users
 */

router.get('/:id', userController.getUser);


module.exports = router;
