const { Router } = require("express");
const router = Router();

const projectController = require("../controllers/projectController");

/**
 * GET
 */
router.get("/:id", projectController.getProjectById);                        
router.get("/:id/team", projectController.getProjectTeam);
router.get("/:id/materials", projectController.getProjectMaterials);        
router.get("/:id/skills", projectController.getProjectSkills);              
router.get("/:id/invitations/sent", projectController.getSentInvitations);
router.get(
    "/:id/invitations/received",
    projectController.getReceivedInvitations
);
router.get("/:id/cards", projectController.getProjectCards);
router.get("/:id/cards/:card_id", projectController.getCardById);
router.get("/search", projectController.searchProject);

/**
 * PUT
 */
router.put("/", projectController.createProject);                               
router.put("/:id/invitations/sent", projectController.sendInvitation);
router.put("/:id/cards", projectController.addNewCard);

/**
 * POST
 */
router.post("/:id", projectController.updateProject);                       
router.post("/:id/skills", projectController.addSkillsToProject);         
router.post("/:id/materials", projectController.addMaterialsToProject);    
router.post(
    "/:id/invitations/received/:inv_id",
    projectController.respondToInvitation
);
router.post("/:id/cards/:card_id", projectController.updateCard);
router.post("/:id/team/:username", projectController.updateMemberRole);

/**
 * DELETE
 */
router.delete("/:id/skills", projectController.deleteSkillsFromProject);           
router.delete("/:id/materials", projectController.deleteMaterialsFromProject);     
router.delete("/:id/team", projectController.deleteTeamMember);
router.delete(
    "/:id/invitations/sent/:inv_id",
    projectController.deleteInvitation
);
router.delete("/:id/cards/:card_id", projectController.deleteCard);         
router.delete("/:id", projectController.deleteProject);                            

module.exports = router;
