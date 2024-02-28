const { User, Skill, Interest } = require("../models");
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
            return next(new CustomError("Bad Cradentials", 409));
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return next(new CustomError("Not Found", 400));
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
 * get user projects
 */
exports.getUserProjects = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return next(new CustomError("Bad Cradentials", 409));
        }

        const user = await User.findByPk(req.params.id);

        if (!user) {
            return next(new CustomError("Not Found", 400));
        }

        const projects = await user.getProjects();

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
        if (!userId) {
            return next(new CustomError("Bad Cradentials", 409));
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return next({ status: 400 });
        }
        const skills = await user.getSkills();
        res.json(skills);
    } catch (err) {
        next(err);
    }
};

/**
 * add user skill
 */
exports.addUserSkill = async (req, res, next) => {
    try {
        const userId = req.auth.payload.sub;
        const skillId = req.body.skill_id;
        if (!skillId) {
            return next(new CustomError("Bad Cradentials", 401));
        }

        const user = await User.findByPk(userId);
        const skill = await Skill.findByPk(skillId);
        if (!user || !skill) {
            return next(new CustomError("Not Found", 400));
        }

        await User.addSkill(skill);
        res.status(200).json({ message: "Skill added successfully" });
    } catch (err) {
        next(err);
    }
};

/**
 * get user interests
 */
exports.getUserInterests = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return next(new CustomError("Bad Cradentials", 409));
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return next({ status: 400 });
        }
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
    try {
        const userId = req.auth.payload.sub;
        const interestId = req.body.interest_id;
        if (!interestId) {
            return next(new CustomError("Bad Cradentials", 401));
        }

        const user = await User.findByPk(userId);
        const interest = await Interest.findByPk(interestId);
        if (!user || !interest) {
            return next(new CustomError("Not Found", 400));
        }

        await User.addInterest(interest);
        res.status(200).json({ message: "Interest added successfully" });
    } catch (err) {
        next(err);
    }
};

/**
 * search on users using query parameters
 */
exports.searchUser = async (req, res, next) => {};
