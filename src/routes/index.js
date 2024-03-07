const UserRouter = require("./userRoute");
const SkillRouter = require("./skillRoute");
const ResourceRouter = require("./resourceRoute");
const ProjectRouter = require("./projectRoute");
const MaterialRouter = require("./materialRoute");
const InterestRouter = require("./interestRoute");

const routers = require("express").Router();

routers.use("/users", UserRouter);
routers.use("/projects", ProjectRouter);
routers.use("/resources", ResourceRouter);
routers.use("/materials", MaterialRouter);
routers.use("/skills", SkillRouter);
routers.use("/interests", InterestRouter);

module.exports = routers;
