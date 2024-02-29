const { Router } = require('express');

const router = Router();

const materialsController = require('../controllers/materialsController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');

/**
 *      Router End-Points starts with
 *      /api/materials    
 */
router.get('/materials/:id', materialsController.getMaterialById);


router.get('/materials/search', materialsController.searchMaterials);


router.put('/materials', validateAccessToken, materialsController.updateMaterial);



module.exports = router; 