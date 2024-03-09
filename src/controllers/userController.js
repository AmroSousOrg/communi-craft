const {
    User,
    Skill,
    Interest,
    Project,
    Resource,
    Invitation,
} = require("../models");
const fetchUserInfo = require("../util/fetchUserInfo");
const CustomError = require("../util/customError");

/**
 * function to get user profile information
 * from database by id
 */
exports.getUserInfo = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return next(new CustomError("Bad Request", 400));
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return next(new CustomError("Not Found", 404));
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

/**
 * get user projects
 * use page size = 20
 */
exports.getUserProjects = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new CustomError("Bad Request", 400));
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return next(new CustomError("Not Found", 404));
        }

        const projects = await user.getProjects();

        res.json(projects);
    } catch (err) {
        next(err);
    }
};

/**
 * get user skills
 * use page size = 20
 */
exports.getUserSkills = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return next(new CustomError("Bad Request", 400));
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return next(new CustomError("Not Found", 404));
        }
        const skills = await user.getSkills();
        res.json(skills);
    } catch (err) {
        next(err);
    }
};

/**
 * get user interests
 * use page size = 20
 */
exports.getUserInterests = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return next(new CustomError("Bad Request", 400));
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return next(new CustomError("Not Found", 404));
        }
        const interests = await user.getInterests();
        res.json(interests);
    } catch (err) {
        next(err);
    }
};

/**
 * get all user resources
 * use pagination with page size = 20
 */
exports.getUserResources = async (req, res, next) => {};

/**
 * get user coming invitations
 * use pagination with page size = 20
 */
exports.getUserInvitations = async (req, res, next) => {};

/**
 * search on users using query parameters
 *
 * Query Params:
 * - skills : skills sub-names
 * - interests : interests sub-names
 * - min_skl : minimum required skills
 * - min_itst : minimum required interests
 * - subname : substring of user name
 */
exports.searchUser = (req, res, next) => {
    //
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
        res.status(201).json({ message: "Created successfully." });
    } catch (err) {
        next(err);
    }
};

/**
 * add user skills
 *
 * Body:
 * - skill_id: Integer[]
 */
exports.addUserSkill = async (req, res, next) => {
    try {
        const userId = req.auth.payload.sub;
        const skillId = req.body.skill_id;
        if (!skillId) {
            return next(new CustomError("Bad Request", 400));
        }

        const user = await User.findByPk(userId);
        const skill = await Skill.findByPk(skillId);
        if (!user || !skill) {
            return next(new CustomError("Not Found", 404));
        }

        await user.addSkills(skill);
        res.status(200).json({ message: "Skill added successfully" });
    } catch (err) {
        next(err);
    }
};

/**
 * add user interests
 *
 * Body:
 * - interest_id: Integer[]
 */
exports.addUserInterest = async (req, res, next) => {
    try {
        const userId = req.auth.payload.sub;
        const interestId = req.body.interest_id;
        if (!interestId) {
            return next(new CustomError("Bad Request", 400));
        }

        const user = await User.findByPk(userId);
        const interest = await Interest.findByPk(interestId);
        if (!user || !interest) {
            return next(new CustomError("Not Found", 404));
        }

        await user.addInterest(interest);
        res.status(200).json({ message: "Interest added successfully" });
    } catch (err) {
        next(err);
    }
};

/**
 * responde to invitation sent to this user.
 *
 * Body:
 * - status: {Accepted, Rejected}
 *
 * use WebSocket to send notification to project admins
 */
exports.respondeInvitation = async (req, res, next) => {};

/**
 * update user profile
 *
 * Body:
 * - name: String (unique)
 */
exports.updateUserProfile = async (req, res, next) => {};

/**
 * delete skills from this user.
 *
 * Body:
 * - skill_id: Integer[]
 */
exports.deleteUserSkills = async (req, res, next) => {};

/**
 * delete interests from this user
 *
 * Body:
 * - interest_id: Integer[]
 */
exports.deleteUserInterests = async (req, res, next) => {};
