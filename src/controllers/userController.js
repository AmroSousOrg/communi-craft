const {
    User,
    Skill,
    Interest,
    Project,
    Resource,
    Invitation,
    UserProject,
} = require("../models");

const { param, check, query } = require("express-validator");

const { check_bad_request, is_exist, getOffset } = require("./utils");

const fetchUserInfo = require("../util/fetchUserInfo");

const CustomError = require("../util/customError");

const { Op } = require("sequelize");

const PAGE_SIZE = 20;

/**
 * function to get user profile information
 * from database by id
 */
exports.getUserInfo = [
    param("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user } = await getUserData(req);
            res.json(user);
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get user projects
 * use pagination
 */
exports.getUserProjects = [
    param("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user, offset } = await getUserData(req);

            const isUserAuth = req.auth.payload.sub === user.id;

            const { count, rows: projects } = await UserProject.findAndCountAll(
                {
                    where: {
                        UserId: user.id,
                    },
                    limit: PAGE_SIZE,
                    offset: offset,
                    include: [
                        {
                            model: Project,
                            where: {
                                [Op.or]: [
                                    { isPublic: true },
                                    ...(isUserAuth
                                        ? [{ isPublic: false }]
                                        : []),
                                ],
                            },
                        },
                    ],
                }
            );

            res.json({
                totalCount: count,
                returnedCount: projects.length,
                projects: projects,
            }); // Adjust based on your needs
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get user skills
 * use pagination
 */
exports.getUserSkills = [
    param("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user, offset } = await getUserData(req);

            const { count, rows: skills } = await Skill.findAndCountAll({
                limit: PAGE_SIZE,
                offset: offset,
                attributes: ["id", "title", "description"],
                include: [
                    {
                        model: User,
                        where: { id: user.id },
                        attributes: [],
                    },
                ],
            });

            res.json({
                totalCount: count,
                returnedCount: skills.length,
                skills: skills,
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get user interests
 * use pagination
 */
exports.getUserInterests = [
    param("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user, offset } = await getUserData(req);

            const { count, rows: interests } = await Interest.findAndCountAll({
                limit: PAGE_SIZE,
                offset: offset,
                attributes: ["id", "title", "description"],
                include: [
                    {
                        model: User,
                        where: { id: user.id },
                        attributes: [],
                    },
                ],
            });

            res.json({
                totalCount: count,
                returnedCount: interests.length,
                Interests: interests,
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get all user resources
 * use pagination
 */
exports.getUserResources = [
    param("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user, offset } = await getUserData(req);

            const { count, rows: resources } = await Resource.findAndCountAll({
                limit: PAGE_SIZE,
                offset: offset,
                include: [
                    {
                        model: User,
                        where: { id: user.id },
                        attributes: [],
                    },
                ],
            });

            res.json({
                totalCount: count,
                returnedCount: resources.length,
                resources: resources,
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * get user outgoing invitations sent
 * use pagination
 */
exports.getUserInvitationsSent = async (req, res, next) => {
    getUserInvitations(req, res, next, "RECEIVED");
};

/**
 * get user coming invitations
 * use pagination
 */
exports.getUserInvitationsReceived = async (req, res, next) => {
    getUserInvitations(req, res, next, "SENT");
};

/**
 * search on users using query parameters
 *
 * Query Params:
 * - skills : skills sub-names
 * - interests : interests sub-names
 * - subname : substring of user name
 */
exports.searchUser = async (req, res, next) => {
    try {
        const { skills, interests, subname } = req.query;
        const offset = getOffset(req);

        // Build query conditions based on query parameters
        const conditions = {};

        // Substring match in username (case-insensitive)
        if (subname) {
            conditions.name = { [Op.like]: `%${subname}%` };
        }

        // Include Skill and Interest associations if skills and interests are specified
        const include = [];
        if (skills) {
            const skillConditions = skills.split(",").map((skill) => ({
                title: { [Op.like]: `%${skill}%` },
            }));
            include.push({
                model: Skill,
                where: {
                    [Op.or]: skillConditions, // Match any skill condition
                },
                through: {
                    attributes: [],
                },
            });
        }
        if (interests) {
            const interestConditions = interests.split(",").map((interest) => ({
                title: { [Op.like]: `%${interest}%` },
            }));
            include.push({
                model: Interest,
                where: {
                    [Op.or]: interestConditions, // Match any skill condition
                },
                through: {
                    attributes: [],
                },
            });
        }

        // Execute the search query with associations included
        const users = await User.findAll({
            where: conditions,
            include: include,
            offset: offset,
            limit: PAGE_SIZE,
        });

        // Return the search results
        res.json({
            returnedCount: users.length,
            users: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * this function is used to create account in User model in database.
 * it requires authentication with autherization server so that we can
 * fetch userInfo, and create account using { sub } value as PK.
 *
 * Authorization: Bearer token
 */
exports.createUser = async (req, res, next) => {
    try {
        const token = req.auth.token;
        // search user id
        const isExist = await User.findByPk(req.auth.payload.sub);
        if (isExist) {
            return next(new CustomError("User already exist", 409));
        }

        // fetch /userInfo
        const userInfo = await fetchUserInfo(token);

        // create user
        const user = {
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
        };
        await User.create(user);

        // return response
        res.status(201).json({
            message: "Created successfully.",
            user: user,
        });
    } catch (err) {
        next(err);
    }
};

/**
 *  user send invitation to join a project.
 *  Body:
 *      - project_id: Integer
 *  use WebSockets
 */
exports.sendInvitation = [
    param("name").exists().isString(),
    check("project_id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const project_id = req.body.project_id;
            const { user } = await check_username_auth(req);

            // check if project exist 
            const project = await Project.findByPk(project_id); 
            is_exist(project); 
            
            const invit = {
                receiverId: req.auth.payload.sub,
                projectId: project_id,
            };

            const isMemeber = await UserProject.findOne({
                where: {
                    userId: user.id,
                    projectId: project_id,
                }
            });
            if (isMemeber) return next(new CustomError(`${user.name} is already member of project team.`, 400));

            const isExist = await Invitation.findOne({ where: {...invit, status: "PENDING"} });
            if (isExist) {
                if (isExist.type === "SENT") return next(new CustomError(`An invitation from ${project_id} project is already sent to ${name}.`, 400));
                else return next(new CustomError(`An invitaion is already sent to join project with id ${project_id}`, 400));
            }

            await Invitation.create({...invit, type: "RECEIVED"});
            res.json({ message: "Invitation sent." });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * add user skills
 *
 * Body:
 * - skill_id: Integer[]
 */
exports.addUserSkill = [
    check("skill_id").exists().isArray(),
    check("skill_id.*").toInt().isInt(),
    param("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const skill_id = req.body.skill_id;
            const { user } = await check_username_auth(req);
            const skills = await Skill.findAll({ where: { id: skill_id } });
            await user.addSkills(skills);
            res.status(200).json({ message: "skills added successfully" });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * add user interests
 *
 * Body:
 * - interest_id: Integer[]
 */
exports.addUserInterest = [
    check("interest_id").exists().isArray(),
    check("interest_id.*").toInt().isInt(),
    param("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const interest_id = req.body.interest_id;
            const { user } = await check_username_auth(req);
            const interests = await Interest.findAll({
                where: { id: interest_id },
            });
            await user.addInterests(interests);
            res.status(200).json({ message: "interests added successfully" });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * responde to invitation sent to this user.
 *
 * Body:
 * - status: {Accepted, Rejected}
 *
 * use WebSocket to send notification to project admins
 */
exports.respondeInvitation = [
    param("name").exists().isString(),
    param("id").exists().toInt().isInt(),
    check("status").exists().isString().isIn(["ACCEPTED", "REJECTED"]),

    async (req, res, next) => {
        try {
            check_bad_request(req);

            const { name, id } = req.params;
            const { status } = req.body;

            // check existance and authorization
            const inv = await Invitation.findOne({
                where: {
                    projectId: id,
                    status: "PENDING",
                    type: "SENT",
                },
                include: {
                    model: User,
                    as: "receiver",
                    where: {
                        name,
                        id: req.auth.payload.sub,
                    },
                },
            });
            is_exist(inv);

            // update invitation table
            await Invitation.update({ status }, { where: { id: inv.id } });

            if (status === "ACCEPTED") {
                // update userproject role
                const user = await User.findByPk(req.auth.payload.sub);
                const project = await Project.findByPk(id);
                await user.addProject(project);
            }

            // response
            res.json({
                message:
                    "user invitaion to project was " +
                    status +
                    " successfully.",
                user: name,
                project: id,
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * update user profile /:name/userinfo
 *
 * Body:
 * - name: String (unique)
 */
exports.updateUserProfile = [
    param("name").exists().isString(),
    check("name").exists().isString(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { name: oldName } = req.params;
            const { name: newName } = req.body;

            const { user } = await check_username_auth(req);

            const isNotUnique = await User.findOne({
                where: { name: newName },
            });
            if (isNotUnique)
                throw new CustomError("Name is already exist.", 409);

            // update name
            await User.update({ name: newName }, { where: { id: user.id } });

            res.json({
                message: "User profile updated successfully.",
                data: { name: newName },
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete skills from this user.
 *
 * Body:
 * - skill_id: Integer[]
 */
exports.deleteUserSkills = [
    param("name").exists().isString(),
    check("skill_id").exists().isArray(),
    check("skill_id.*").toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user } = await check_username_auth(req);
            const { skill_id } = req.body;
            await user.removeSkills(skill_id);
            res.json({
                message: "Skills removed successfully.",
                skills: skill_id,
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete interests from this user
 *
 * Body:
 * - interest_id: Integer[]
 */
exports.deleteUserInterests = [
    param("name").exists().isString(),
    check("interest_id").exists().isArray(),
    check("interest_id.*").toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user } = await check_username_auth(req);
            const { interest_id } = req.body;
            await user.removeInterests(interest_id);
            res.json({
                message: "Interests removed successfully.",
                interests: interest_id,
            });
        } catch (err) {
            next(err);
        }
    },
];

/**
 * delete sent invitation request by this user to join a project
 */
exports.deleteSentInvitation = [
    param("name").exists().isString(),
    param("project_id").exists().toInt().isInt(),

    async (req, res, next) => {
        try {
            check_bad_request(req);
            const { user } = await check_username_auth(req);
            const projectId = parseInt(req.params.project_id);

            const invitation = await Invitation.findOne({
                where: {
                    projectId: projectId,
                    receiverId: user.id, 
                    type: "RECEIVED",
                    status: "PENDING",
                },
            });

            is_exist(invitation);

            await invitation.destroy();
            res.json({
                message: `Join request to project ${projectId} was deleted successfully.`,
            });
        } catch (err) {
            next(err);
        }
    },
];

//=============================================== Utilities =========================================

/**
 * utitlity method to check if name in request is
 * for authenticated user.
 */
const check_username_auth = async (req) => {
    const username = req.params.name;

    const isAuthenticated = await User.findOne({
        where: {
            id: req.auth.payload.sub,
            name: username,
        },
    });

    if (!isAuthenticated) {
        throw new CustomError("Not authorized", 401);
    }

    return { user: isAuthenticated };
};

/**
 * utility method to get user data and offset pagination from
 * the request, this method extracted from several methods to make
 * better code reusablility.
 */
const getUserData = async (req) => {
    const offset = getOffset(req);
    const username = req.params.name;

    const user = await User.findOne({ where: { name: username } });
    if (!user) {
        throw new CustomError("Not Found", 404);
    }

    return { user, offset };
};

//--------------------------------===========================--------------------------===================

/**
 * utility method to get user invitations according to type
 * SENT/RECEIVED
 */
const getUserInvitations = [
    param("name").exists().isString(),

    async (req, res, next, type) => {
        try {
            const { user, offset } = await getUserData(req, next);

            const { count, rows: invitations } =
                await Invitation.findAndCountAll({
                    limit: PAGE_SIZE,
                    offset: offset,
                    where: {
                        type: type,
                        status: "PENDING",
                    },
                    include: [
                        {
                            model: User,
                            as: "receiver",
                            where: { id: user.id },
                            attributes: [],
                        },
                    ],
                });

            res.json({
                totalCount: count,
                returnedCount: invitations.length,
                invitations: invitations,
            });
        } catch (err) {
            next(err);
        }
    },
];
