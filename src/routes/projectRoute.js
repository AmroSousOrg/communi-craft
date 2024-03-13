const { Router } = require('express');
const router = Router();

const projectController = require('../controllers/projectController');
/**
 *      Router End-Points starts with
 *      /api/projects     
 */



router.post('/:id/skills', projectController.addSkillsToProject);

router.post('/:id/materials', projectController.addMaterialsToProject);

router.delete('/:id/materials', projectController.deleteMaterialsFromProject);

router.delete('/:id/skills', projectController.deleteSkillsFromProject);

router.get('/:id', projectController.getProjectById);








module.exports = router; 