const { User, Project, UserProject } = require("../models");
const fetchUserInfo = require("../util/fetchUserInfo");

/**
 * function to get user profile information
 * from database by id
 */
exports.getUserInfo = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            const err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

/**
 * this function is used to create account in User model in database.
 * it requires authentication with autherization server so that we can
 * fetch userInfo, and create account using { sub } value as PK.
 */
exports.createUser = async (req, res, next) => {
    // const token = req.get('Authorization').split(' ')[1];
    try {
        const token = req.auth.token;
        // search user id
        const isExist = await User.findByPk(req.auth.payload.sub);
        if (isExist) {
            return res.status(409).json({ message: "User already exist " });
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
        res.status(201).json({ message: "User account created successfully." });
    } catch (err) {
        next(err);
    }
};

/**
 * get user projects
 */
exports.getUserProjects = async (req, res, next) => {
    try {
        const projectsIds = await UserProject.findAll({
            where: { UserId: req.params.id },
        });

        const projects = await Promise.all(
            projectsIds.map(async (proj) => {
                const project = await Project.findByPk(proj.ProjectId);
                return { project: project.dataValues, role: proj.role };
            })
        );

        res.json(projects);
    } catch (err) {
        next(err);
    }
};

/**
 * get user skills
 */
exports.getUserSkills = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        const skills = await user.getSkills();
        res.json(skills);
    } catch (err) {
        next(err);
    }
};

/**
 * add user skill
 */
exports.addUserSkill = async (req, res, next) => {};

/**
 * get user interests
 */
exports.getUserInterests = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        const interests = await user.getInterests();
        res.json(interests);
    } catch (err) {
        next(err);
    }
};

/**
 * add user interests
 */
exports.addUserInterest = async (req, res, next) => {
    // const userId = req.auth.payload.sub;
    // const skillId = req.body.skillId;
    // const user = await User.findByPk(userId);
    // await user.addInterest()
};

/**
 * search on users using query parameters
 */
exports.searchUser = async (req, res, next) => {};
