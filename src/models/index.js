const Project = require("./project");
const UserProject = require("./userProject");
const Material = require("./material");
const Resource = require("./resource");
const Skill = require("./skill");
const Interest = require("./interest");
const Invitation = require("./invitation");
const User = require("./user");
const Card = require("./card");

// define associations
Project.belongsToMany(User, { through: UserProject });
User.belongsToMany(Project, { through: UserProject });

Card.belongsTo(User, { foreignKey: 'user' });
Card.belongsTo(Project, { foreignKey: 'project' });

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

Invitation.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });
Invitation.belongsTo(Project, { foreignKey: "projectId" });

module.exports = {
    Project,
    UserProject,
    Material,
    Resource,
    Skill,
    Interest,
    Invitation,
    User,
};
