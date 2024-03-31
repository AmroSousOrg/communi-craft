const { Router } = require('express');

const router = Router();

const materialsController = require('../controllers/materialController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');


/**
 * GET
 */
router.get('/search', materialsController.searchMaterials);
router.get('/:id', materialsController.getMaterialById);
router.get('/', materialsController.getAllMaterials);

/**
 * PUT
 */
router.put('/', materialsController.addMaterial);


/**
 * POST
 */
router.post('/',materialsController.updateMaterial);

/**
 * DELETE
 */
router.delete('/:id', materialsController.deleteMaterial);


module.exports = router; 