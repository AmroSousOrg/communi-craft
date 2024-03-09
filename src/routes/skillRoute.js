const { Router } = require("express");

const router = Router();
const skillController = require("../controllers/skillController");

/**
 *      Router End-Points starts with
 *      /api/skills
 */
router.get("/", skillController.getAllSkills);
router.get("/search", skillController.searchSkills);
router.get("/:id", skillController.getSkillsById);
router.put("/:id",skillController.updateById);
router.post("/",skillController.newSkill);
router.delete("/:id",skillController.deleteById);

module.exports = router;
