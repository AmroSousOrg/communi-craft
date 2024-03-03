const { Router } = require('express');

const router = Router();


const interestController = require('../controllers/interestController');
const { validateAccessToken } = require('../middlewares/auth0.middleware');

/**
 *      Router End-Points starts with
 *      /api/interests
 */

router.post('/interests', interestController.createInterest);

router.get('/interests/:id', interestController.getInterestById);

router.get('/interests/search', interestController.searchInterests);

router.put('/interests', validateAccessToken , interestController.updateInterest);


module.exports = router; 