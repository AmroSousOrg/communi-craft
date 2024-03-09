const express = require('express');

const { validateAccessToken } = require('../middlewares/auth0.middleware');


const router = express.Router();

const resourceController=require('../controllers/resourceController');

/**
 *      Router End-Points starts with
 *      /api/resources     
 */
router.get('/',resourceController.getAllResources);
router.get('/search', resourceController.searchResources);
router.get('/:id',resourceController.getResourcesById);
router.put('/:id',validateAccessToken,resourceController.updateById);
router.put('/:id/buy',resourceController.buyResources);
router.delete('/:id',validateAccessToken,resourceController.deleteById);
router.post('/',validateAccessToken,resourceController.newResources);     



module.exports = router; 