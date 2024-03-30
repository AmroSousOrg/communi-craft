const models = require("../models");
const { Op } = require("sequelize");
const CustomError = require("../util/customError");
const { check, param, query } = require("express-validator");
const {
    check_bad_request,
    getOffset,
    is_exist,
    is_project_admin,
} = require("./utils");
const PAGE_SIZE = 20;

/**
 * get project info by project id
 */
exports.getProjectById = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);

            const { id } = req.params; // Get the project ID from the URL

            const project = await models.Project.findByPk(id);
            is_exist(project);

            res.status(200).json(project);
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get project team members.
 * use pagination.
 */
exports.getProjectTeam = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            //const offset = getOffset(req);
            const { id } = req.params;
            const project = await models.Project.findByPk(id);
            is_exist(project);
            const projectId = req.params.id;
            const teamMembers = await models.UserProject.findAll({
            where: { projectId: projectId },
            include: [{
                model: models.User,
                attributes: ['id', 'name', 'email'], 
            }]
        });
          
        if (!teamMembers.length) {
            return res.status(404).json({ message: "No team members found for this project" });
        }
        const membersData = teamMembers.map(association => association.User);

        res.json({
            projectId: projectId,
            teamMembers: membersData
        });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get all project materials.
 * use pagination.
 */
exports.getProjectMaterials = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
          //  const offset = getOffset(req);
          const { id } = req.params;
          const project = await models.Project.findByPk(id);
          is_exist(project);
          const projectId = req.params.id;
          const materials = await models.Project.findOne({
            where: { id: projectId },
            include: [{
                model: models.Material,
                as: 'Materials', 
                through: { attributes: [] } 
            }]
        });
        if (!materials.Materials.length) {
            return res.status(404).json({ message: " No materials associated with this project" });
        }
        res.json({
            projectId: projectId,
            materials: materials.Materials 
        });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get project skills.
 * use pagination.
 */
exports.getProjectSkills = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
         // const offset = getOffset(req);
          const { id } = req.params;
          const project = await models.Project.findByPk(id);
          is_exist(project);
           const projectId = req.params.id;
           const projectWithSkills = await models.Project.findOne({
            where: { id: projectId },
            include: [{
                model: models.Skill,
                as: 'Skills',
                through: { attributes: [] } 
            }]
        });
        if (!projectWithSkills.length) {
            return res.status(404).json({ message: " No skills associated with this project" });
        }
        res.json({
            projectId: projectId,
            skills: projectWithSkills.Skills 
        });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get sent invitation to users
 * use pagination
 */
exports.getSentInvitations = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const offset = getOffset(req);
            const { id } = req.params;
            const project = await models.Project.findByPk(id);
            is_exist(project);
            const invitations = await models.Invitation.findAll({
            where: { projectId: id, type: 'SENT'},
            offset: offset,
            limit: PAGE_SIZE,
            include: [{
                model:models.Invitation,
                as: 'Invitations',
                attributes: ['id', 'status', 'type'],
            }]
        });
        if (!invitations.length) {
            return res.status(404).json({ message: "No invitations found for this project" });
        }
        res.json({
            projectId: id,
            invitations: invitations
        });

        } catch (err) {
            next(err);
        }
    },
];

/**
 * get received invitation requests from users
 * use pagination
 */
exports.getReceivedInvitations = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const offset = getOffset(req);
            const { id } = req.params;
            const project = await models.Project.findByPk(id);
            is_exist(project);
            const invitations = await models.Invitation.findAll({
            where: { projectId: id, type: 'RECEIVED'},
            offset: offset,
            limit: PAGE_SIZE,
            include: [{
                model:models.Invitation,
                as: 'Invitations',
                attributes: ['id', 'status', 'type'],
            }]
        });
        if (!invitations.length) {
            return res.status(404).json({ message: "No invitations found for this project" });
        }
        res.json({
            projectId: id,
            invitations: invitations
        });

        } catch (err) {
            next(err);
        }
    },
];

/**
 * get all project cards
 * use pagination
 */
exports.getProjectCards = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            // const offset = getOffset(req);
            const projectId=req.params.id;
            const cards=await models.Card.findAll({where:{project:projectId}});

            if(!(cards.length)){
                throw new CustomError("List is Empty",404);
            }
            res.status(200).json({
                message:"successfully",
                result:cards
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get specific project card by card ID
 */
exports.getCardById = [
    param("id").exists().toInt().isInt(),
    param("card_id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const cardId=req.params.card_id;
            const projectId=req.params.id;
            const card= await models.Card.findOne({where:{project:projectId,id:cardId}});
            if(!card){
                throw new CustomError("Card not found",404);
            }
            res.status(200).json({
                message:"successfully",
                result:card
            })
            
        } catch (err) {
            next(err);
        }
    },
];

/**
 * search for projects according to params
 * use Pagination
 *
 * Query Params:
 *  - subtitle: String
 *  - level: String[]
 *  - finished_after: Date
 *  - skills: String[]
 *  - materials: String[]
 *  - status: Stirng[]
 *  - location: String
 */
exports.searchProject = [
    query("subtitle").optional().isString(),
    query("level").optional().isArray(),
    query("level.*").optional().isIn("Beginnere", "Intermediate", "Advanced"),
    query("finished_after").optional().isDate(),
    query("skills").optional().isArray(),
    query("skills.*").optional().isString(),
    query("materials").optional().isArray(),
    query("materials.*").optional().isString(),
    query("status").optional().isArray(),
    query("status.*").optional().isIn(["PLANNING", "PROGRESS", "FINISHED"]),
    query("location").optional().isString(),

    async (req, res, next) => {
        try {
            const offset = getOffset(req);
            // your code here
        } catch (err) {
            next(err);
        }
    },
];

/**
 * create new project.
 *
 * Body:
 *  - title: String
 *  - description: String
 *  - isPublic: Boolean
 *  - level: String { Beginner, Intermediate, Advanced }
 *  - status: String { PLANNING, PROGRESS, FINISHED }
 *  - location: String
 */
exports.createProject = [
    check("title").exists().isString(),
    check("description").optional().isString(),
    check("isPublic").optional().isBoolean(),
    check("level").exists().isIn(["Beginner", "Intermediate", "Advanced"]),
    check("status").optional().isIn(["PLANNING", "PROGRESS", "FINISHED"]),
    check("location").optional().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { title, description, isPublic, level, status, location } = req.body;
            const userId = req.auth.payload.sub;
    if (!userId) {
      return res.status(403).json({ message: "User must be authenticated to create a project." });
    }
    const project = await models.Project.create({
        title,
        description,
        isPublic,
        level,
        status,
        location,
      });

      await models.UserProject.create({
        ProjectId: project.id,
        UserId: userId,
        role: 'Admin',
      });
      res.status(201).json({
        message: "Project created successfully and user set as admin.",
        project,
      });

        } catch (err) {
            next(err);
        }
    },
];

/**
 * send invitation by project admins to user
 * asking for join the project team.
 *
 * Body:
 *  - username: String
 */
exports.sendInvitation = [
    param("id").exists().toInt().isInt(),
    check("username").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);

            // your code here
        } catch (err) {
            next(err);
        }
    },
];

/**
 * add new card to project.
 *
 * Body:
 *  - subject: String
 *  - details: String
 *  - username: String
 *  - project: Integer
 *  - due_date: Date
 */
exports.addNewCard = [
    param("id").exists().toInt().isInt(),
    check("subject").exists().isString(),
    check("details").exists().isString(),
    check("username").exists().isString(),
    check("project").exists().toInt().isInt(),
    check("due_date").optional().isDate(),

    async(req,res,next)=>{
        try{
            // check_bad_request(req);
            const {id} = req.params;
            const {subject,details,username,due_date}=req.body;

            const user=await models.User.findByPk(username);

            if(!user){
                throw new CustomError("User not found",404);
            }
            const project=await models.Project.findByPk(id);
            if(!project){
                throw new CustomError("Project not found",404);
            }
            const cardInfo={
                subject:subject,
                details:details,
                user:username,
                project:id,
                due_date:due_date,
            };

            models.Card.create(cardInfo).then(card=>{
                res.status(200).json({
                    message:"Created Successfully",
                    result:card
                })
            }).catch(error=>{
                next(error);
            });
        }catch(err){
            next(err);
        }
    },
];

/**
 * update project info.
 */
exports.updateProject = [
    param("id").exists().toInt().isInt(),
    check("title").optional().isString(),
    check("description").optional().isString(),
    check("isPublic").optional().isBoolean(),
    check("level").optional().isIn(["Beginner", "Intermediate", "Advanced"]),
    check("status").optional().isIn(["PLANNING", "PROGRESS", "FINISHED"]),
    check("location").optional().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);

            const projectId = req.params.id;
            const updateData = req.body;

            const project = await models.Project.findByPk(projectId);
            is_project_admin(req, project);
            await project.update(updateData);

            res.json({
                message: "Project updated successfully",
               // project
            });
            
        } catch (err) {
            next(err);
        }
    },
];

/**
 * add skills to project
 * Body:
 *  - skill_id: Integer[]
 */
exports.addSkillsToProject = [
    param("id").exists().toInt().isInt(),
    check("skill_ids").exists().isArray(),
    check("skill_ids").toInt().isInt(),

    async (req, res, next) => {
        try {
             check_bad_request(req);
            const { id } = req.params; // Project ID from the URL
            const { skill_ids } = req.body; // Array of Skill IDs from the request body
            const project = await models.Project.findByPk(id);
            is_project_admin(req, project);
            await project.addSkills(skill_ids);
            return res.status(200).json({
                message: "Skills added to the project successfully.",
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * add materials to project
 * Body:
 *  - material_id: Integer[]
 */
exports.addMaterialsToProject = [
    param("id").exists().toInt().isInt(),
    check("material_id").exists().isArray(),
    check("material_id.*").toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);

            const { id } = req.params; // Project ID from URL
            const { material_id } = req.body; // Array of Material IDs from the request body
            const project = await models.Project.findByPk(id);
            is_project_admin(req, project);
            await project.addMaterials(material_id);
            res.status(200).json({
                message: "Materials added to the project successfully.",
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * responde to received invitations
 * Body:
 *  - status: { Accepted, Rejected }
 */
exports.respondToInvitation = [
    param("id").exists().toInt().isInt(),
    param("inv_id").exists().toInt().isInt(),
    check("status").exists().isIn("Accepted", "Rejected"),

    async (req, res, next) => {
        try {
            check_bad_request(req);

            // your code here
        } catch (err) {
            next(err);
        }
    },
];

/**
 * update project card
 * Body:
 *  - subject: String
 *  - details: String
 *  - username: String
 *  - project: Integer
 *  - due_date: Date
 *  - status: String
 */
exports.updateCard = [
    param("id").exists().toInt().isInt(),
    param("card_id").exists().toInt().isInt(),
    check("subject").optional().isString(),
    check("details").optional().isString(),
    check("user").optional().isString(),
    check("project").optional().toInt().isInt(),
    check("due_date").optional().isDate(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const {id,card_id} = req.params;
            const { subject,details,user,project,due_date,}=req.body;
            const users=await models.User.findByPk(user);

            if(!users){
                throw new CustomError("User not found",404);
            }
            const updateCard={
                subject:subject,
                details:details,
                user:user ,
                project:project,
                due_date:due_date,
            }; 
            const project_ = await models.Project.findByPk(id);
            (is_project_admin(req, project_))
            const card = await models.Card.findOne({where:{id:card_id,project:id}});
            if (!card){
                return res.status(404).json({error:"Card not found"});
            }
            await card.update(updateCard);
            res.status(200).json({message:"Card updated successfully"});
        } catch (err) {
            next(err);
        }
    },
];

/**
 * update project team member role
 * Body:
 *  - role: { Admin, Collaborator }
 */
exports.updateMemberRole = [
    param("id").exists().toInt().isInt(),
    param("username").exists().isString(),

    async (req, res, next) => {
        try {
        check_bad_request(req);
        const { id, username } = req.params;
        const { role } = req.body;
        const project = await models.Project.findByPk(id);
        is_project_admin(req, project);

        const user = await models.User.findOne({ where: { name: username } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const projectUserAssociation = await models.UserProject.findOne({
                where: {
                    ProjectId: id,
                    UserId: user.id
                }
            });

            if (!projectUserAssociation) {
                return res.status(404).json({ message: "Project member not found" });
            }
            projectUserAssociation.role = role;
            await projectUserAssociation.save();

            res.status(200).json({
                message: "Project member role updated successfully",
                projectUser: projectUserAssociation
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete skills from project
 * Body:
 *  - skill_id: Integer[]
 */
exports.deleteSkillsFromProject = [
    param("id").exists().toInt().isInt(),
    check("skill_id").exists().isArray(),
    check("skill_id.*").toInt().isInt(),

    async (req, res, next) => {
        try {
             check_bad_request(req);

            const { id } = req.params; // Project ID from URL
            const { skill_id } = req.body; // Array of Skill IDs from the request body
            const project = await models.Project.findByPk(id);

             is_project_admin(req, project);
            await project.removeSkills(skill_id);

            res.status(200).json({
                message: "Skills removed from the project successfully.",
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete materials from project
 * Body:
 *  - material_id: Integer[]
 */
exports.deleteMaterialsFromProject = [
    param("id").exists().toInt().isInt(),
    check("material_id").exists().isArray(),
    check("material_id.*").toInt().isInt(),

    async (req, res, next) => {
        try {
             check_bad_request(req);

            const { id } = req.params; // Project ID from URL
            const { material_id } = req.body; // Array of Material IDs from the request body

            const project = await models.Project.findByPk(id);
            is_project_admin(req, project);
            await project.removeMaterials(material_id);

            res.status(200).json({
                message: "Materials deleted from the project successfully.",
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete team member from project team
 * Body:
 *  - name: String
 */
exports.deleteTeamMember = [
    param("id").exists().toInt().isInt(),
    check("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
             const projectId = req.params.id;
             const { name } = req.body;
         const user = await models.User.findOne({
            where: { name }
        });
         const userProject = await models.UserProject.findOne({
            where: {
                projectId: projectId,
                userId: user.id
            }
        });
        if (!userProject) {
            return res.status(404).json({ message: "Team member not associated with this project" });
        }
        await userProject.destroy();
        res.status(200).json({ message: "Team member deleted successfully" });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete sent invitation to user
 */
exports.deleteInvitation = [
    param("id").exists().toInt().isInt(),
    param("inv_id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);

            // your code here
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete project card by card ID
 */
exports.deleteCard=[
    param("id").exists().toInt().isInt(),
    param("card_id").exists().toInt().isInt(),

    async(req, res,next)=>{
        try {
            check_bad_request(req);
            const cardId = req.params.card_id;
            const projectid=req.params.id;
            const card = await models.Card.findByPk(cardId);
            if (!card) {
                throw new CustomError("Card not found",404);
            }
            const project=await models.Project.findByPk(projectid);
            if(!project){
                throw new CustomError("Project not found",404);
            }
            is_project_admin(req,project);
            await card.destroy();

            res.status(200).json({message:"Card deleted successfully"});
        }catch(err){
            next(err);
        }
    },
];

/**
 * delete whole project by project ID
 * By project Admins only
 */
exports.deleteProject = [
    param("id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);

        const projectId = req.params.id;
        const project = await models.Project.findByPk(projectId);
        is_project_admin(req, project);
        await project.destroy();

        res.status(200).json({
            message: "Project deleted successfully"
        });
        } catch (err) {
            next(err);
        }
    },
];
