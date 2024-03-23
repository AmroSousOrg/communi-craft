const { Router } = require('express');

const router = Router();

const materialsController = require('../controllers/materialController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');


/**
 * GET
 */
router.get('/search', materialsController.searchMaterials);
router.get('/:id', materialsController.getMaterialById);
router.get('/', validateAccessToken, materialsController.getAllMaterials);

/**
 * PUT
 */
router.put('/', validateAccessToken, materialsController.addMaterial);


/**
 * POST
 */
router.post('/', validateAccessToken, materialsController.updateMaterial);

/**
 * DELETE
 */
router.delete('/:id', validateAccessToken, materialsController.deleteMaterial);


module.exports = router; 