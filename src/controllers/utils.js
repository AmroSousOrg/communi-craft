/** ================================================================
 *
 *  This file contains utility functions to perform common
 *  operations along all controllers, you can use these methods
 *  instead of writing it from scratch.
 *
 * =================================================================
 */
const { validationResult } = require("express-validator");
const { UserProject } = require("../models");

/**
 *
 *
 * util function to check if there is any errors
 * in validation results of express-validator
 * then it thows Bad Request error
 *
 */
exports.check_bad_request = (req) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        throw new CustomError("Bad Request", 400);
    }
};

/**
 *
 *
 * utility to calculate offset for pagination
 * from page query param in req
 *
 */
exports.getOffset = (req) => {
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * PAGE_SIZE;
    return offset;
};

/**
 *
 *
 * utility check if parameters exist and not empty
 * it throws Not Found CustomError
 *
 */
exports.is_exist = (...params) => {
    for (const p of params)
        if (!p) {
            throw new CustomError("Not Found", 404);
        }
};

/**
 *
 *
 * utility to check if user is admin of project
 * it throws Unauthorized custom error if he is not admin
 *
 */
exports.is_project_admin = async (req, project) => {
    this.is_exist(project);
    const role = await UserProject.findOne({
        where: {
            UserId: req.auth.payload.sub,
            ProjectId: project.id,
        },
        attributes: ["role"],
    });
    if (!role || role !== "Admin") {
        throw new CustomError("Unothorized operation", 401);
    }
};
