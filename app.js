/**
 *  ComuniCraft main driver
 *
 *  @author __ASWP Group
 */

// global packages
const express = require("express");
const bodyParser = require("body-parser");

// our packages
const sequelize = require("./src/util/database");
const cors = require("./src/middlewares/cors");
const auth = require('./src/middlewares/auth');
// models
const User = require("./src/models/user");
const Project = require("./src/models/project");
const UserProject = require("./src/models/userProject");
const Material = require("./src/models/material");
const Resource = require("./src/models/resource");
const Skill = require("./src/models/skill");
const Interest = require("./src/models/interest");
const Invitation = require("./src/models/invitation");
// routers
const UserRouter = require("./src/routes/userRoute");
const SkillRouter = require("./src/routes/userRoute");
const ResourceRouter = require("./src/routes/resourceRoute");
const ProjectRouter = require("./src/routes/userRoute");
const MaterialRouter = require("./src/routes/userRoute");
const InterestRouter = require("./src/routes/userRoute");

// creating express application
const app = express();

/**
 *  Our App Configuration
 */

// association between models
Project.belongsToMany(User, { through: UserProject });
User.belongsToMany(Project, { through: UserProject });

User.belongsToMany(Skill, { through: "UserSkill" });
Skill.belongsToMany(User, { through: "UserSkill" });

User.belongsToMany(Interest, { through: "UserInterest" });
Interest.belongsToMany(User, { through: "UserInterest" });

Project.belongsToMany(Skill, { through: "ProjectSkill" });
Skill.belongsToMany(Project, { through: "ProjectSkill" });

Project.belongsToMany(Material, { through: "ProjectMaterial" });
Material.belongsToMany(Project, { through: "ProjectMaterial" });

Resource.belongsTo(User, { foreignKey: "owner" });
Resource.belongsTo(Material, { foreignKey: "type" });

Invitation.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Invitation.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });
Invitation.belongsTo(Project, { foreignKey: "projectId" });

// for parsing body of request from json format to javascript object
app.use(bodyParser.json());

// CORS middlewares
app.use(cors);

// authentication
app.use(auth);

// routers configuration
app.use("/users", UserRouter);
app.use("/skills", SkillRouter);
app.use("/interests", InterestRouter);
app.use("/resources", ResourceRouter);
app.use("/projects", ProjectRouter);
app.use("/materials", MaterialRouter);

sequelize
    // syncing models and relations with db
    .sync({
        /*force: true*/
    })
    .then(() => {
        console.log("DB Connected");
        return User.findByPk(1);
    })
    .then((user) => {
        if (!user) {
            User.create({
                name: "Zaid",
                password: "12345",
                email: "example@najah.edu",
            });
        }
        return user;
    })
    .then(() => {
        app.listen(8080); // server starts listening on port 8080
    })
    .catch((err) => {
        console.log(err);
    });
