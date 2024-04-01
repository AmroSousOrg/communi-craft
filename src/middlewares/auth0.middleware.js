/**
 *  oauth0 configuration file
 */
const { User } = require('../models');
const {
    auth,
    claimCheck,
    InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");
const CustomError = require('../util/customError');

/**
 *  validateAccessToken middleware is used to
 *  validate the accessToken set by user in Autherization Header
 *  for authentication
 */
const validateAccessToken = auth({
    issuerBaseURL: `https://dev-ewlm305yder635da.us.auth0.com/`, //`https://${process.env.AUTH0_DOMAIN}`,
    audience: `http://localhost:8080`, //process.env.AUTH0_AUDIENCE
    tokenSigningAlg: "RS256",
});

/**
 *  to check if user has an account or not.
 *  if not then return 404 NOT_FOUND.
 *  create user route is exepted from this middleware.
 */
const checkValidAccount = async (req, res, next) => {

    if (req.path === "/users" && req.method === "PUT") return next();

    const user = await User.findByPk(req.auth.payload.sub);
    if (!user) {
        return next(new CustomError("User Doesn't have account", 404));
    }

    next();
};

/**
 *  checkRequiredPermissions middleware is used to check if
 *  user has specific permissions to access API end-point.
 */
const checkRequiredPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        const permissionCheck = claimCheck((payload) => {
            const permissions = payload.permissions || [];

            const hasPermissions = requiredPermissions.every(
                (requiredPermission) => permissions.includes(requiredPermission)
            );

            if (!hasPermissions) {
                throw new InsufficientScopeError();
            }

            return hasPermissions;
        });

        permissionCheck(req, res, next);
    };
};

module.exports = {
    validateAccessToken,
    checkRequiredPermissions,
    checkValidAccount
};
