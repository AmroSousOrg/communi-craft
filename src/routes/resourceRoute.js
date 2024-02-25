const express = require('express');


const router = express.Router();

const resourceController=require('../controllers/resourceController');

/**
 *      Router End-Points starts with
 *      /api/resources     
 */

router.post('/',resourceController.newResources);     
router.get('/:id',resourceController.getResourcesById);
router.get('/',resourceController.getAllResources);
router.patch('/:id',resourceController.update);
router.delete('/:id',resourceController.deleteById);



module.exports = router; 