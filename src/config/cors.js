/**
 * cors middleware configuration
 **/

const corsConfig = {
    origin: "*",
    methods: ["OPTIONS", "GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
};

module.exports = corsConfig;