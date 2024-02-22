const UserRouter = require("./userRoute");
const SkillRouter = require("./userRoute");
const ResourceRouter = require("./userRoute");
const ProjectRouter = require("./userRoute");
const MaterialRouter = require("./userRoute");
const InterestRouter = require("./userRoute");

const router = require('express').Router(); 

/**
 *  Routers prefix URL's
 */
router.use('/users', UserRouter);
router.use('/skills', SkillRouter);
router.use('/resources', ResourceRouter);
router.use('/projects', ProjectRouter);
router.use('materials', MaterialRouter);
router.use('interests', InterestRouter); 

module.exports = router;