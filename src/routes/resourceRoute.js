const { Router } = require('express');

const router = Router();

const resourceController=require('../controllers/resourceController');


// router.post('/',resourceController.newResources);     
// router.get('/:id',resourceController.getResourcesById);
router.get('/',resourceController.getAllResources);
// router.patch('/:id',resourceController.update);
/**
 *      Router End-Points starts with
 *      /api/resources     
 */


module.exports = router; 