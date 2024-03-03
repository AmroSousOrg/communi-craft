const { Router } = require('express');

const router = Router();

const materialsController = require('../controllers/materialController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');

/**
 *      Router End-Points starts with
 *      /api/materials    
 */

router.post('/materials', validateAccessToken, materialsController.addMaterial);

router.get('/materials/:id', materialsController.getMaterialById);


router.get('/materials/search', materialsController.searchMaterials);


router.put('/materials', validateAccessToken, materialsController.updateMaterial);


router.delete('/materials/:id', validateAccessToken, materialsController.deleteMaterial);



module.exports = router; 