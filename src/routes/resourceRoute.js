const express = require('express');

const { validateAccessToken } = require('../middlewares/auth0.middleware');


const router = express.Router();

const resourceController=require('../controllers/resourceController');

/**
 *      Router End-Points starts with
 *      /api/resources     
 */

router.post('/',validateAccessToken,resourceController.newResources);     
router.get('/:id',resourceController.getResourcesById);
router.get('/',resourceController.getAllResources);
router.put('/:id',validateAccessToken,resourceController.updatebyid);
router.delete('/:id',validateAccessToken,resourceController.deleteById);
// router.get('/search',resourceController.searchResources);



module.exports = router; 