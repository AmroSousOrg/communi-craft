const { Router } = require('express');

const router = Router();


const interestController = require('../controllers/interestController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');

/**
 *      Router End-Points starts with
 *      /api/interests
 */

router.post('/', validateAccessToken, interestController.createInterest);

router.get('/:id', interestController.getInterestById);

router.get('/search', interestController.searchInterests);

router.put('/', validateAccessToken, interestController.updateInterest);

router.delete('/:id', validateAccessToken, interestController.deleteInterest);

router.get('/', validateAccessToken, interestController.getAllInterests);


module.exports = router; 