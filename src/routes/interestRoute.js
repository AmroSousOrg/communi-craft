const { Router } = require('express');

const router = Router();


const interestController = require('../controllers/interestController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');

/**
 * GET
 */
router.get('/search', interestController.searchInterests);
router.get('/:id', interestController.getInterestById);
router.get('/', interestController.getAllInterests);

/**
 * PUT
 */
router.put('/', interestController.createInterest);

/**
 * POST
 */
router.post('/', interestController.updateInterest);

/**
 * DELETE
 */
router.delete('/:id', interestController.deleteInterest);


module.exports = router; 