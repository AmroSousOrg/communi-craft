const { Router } = require('express');

const router = Router();

const materialsController = require('../controllers/materialController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');

/**
 *      Router End-Points starts with
 *      /api/materials    
 */

router.post('/', validateAccessToken, materialsController.addMaterial);

router.get('/:id', materialsController.getMaterialById);


router.get('/search', materialsController.searchMaterials);


router.put('/', validateAccessToken, materialsController.updateMaterial);


router.delete('/:id', validateAccessToken, materialsController.deleteMaterial);


router.get('/', validateAccessToken, materialsController.getAllMaterials);




module.exports = router; 