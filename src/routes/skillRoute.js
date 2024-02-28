const { Router } = require('express');

const router = Router();
const skillController=require('../controllers/skillController')
/**
 *      Router End-Points starts with
 *      /api/skills     
 */
router.use('/:id',skillController.getSkillsById);
module.exports = router; 