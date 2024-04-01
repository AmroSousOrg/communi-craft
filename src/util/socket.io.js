const { UserProject } = require("../models");

class SocketManager {
    constructor(io) {
        this.io = io;
        this.usersConnections = {}; // Store user connections
        this.initialize();
    }

    initialize() {
        this.io.on("connection", (socket) => {

            socket.on("authenticate", (userId) => {
                // Store the user's connection
                this.usersConnections[userId] = socket.id;
            });

            socket.on("disconnect", () => {

                // Remove the user's connection from the store
                Object.keys(this.usersConnections).forEach((userId) => {
                    if (this.usersConnections[userId] === socket.id) {
                        delete this.usersConnections[userId];
                    }
                });
            });
        });
    }

    sendNotification(userId, message) {
        const userSocketId = this.usersConnections[userId];
        if (userSocketId) {
            this.io.to(userSocketId).emit("notification", message);
        }
    }

    async notifyProjectAdmins(project, message) {
        const admins = await UserProject.findAll({
            where: {
                projectId: project.id,
                role: "Admin",
            },
            attributes: ["userId"],
        });
        await admins.forEach(admin => {
            this.sendNotification(admin.userId, message);
        });
    }
}

module.exports = SocketManager;
