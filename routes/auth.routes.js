const {verifySignUp} = require("../middlewares");
const controller = require("../controllers/auth.controller");
const {updateLoginAttempts, limiter} = require("../middlewares/updateLoginAttempts");
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for authentication
 */
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        controller.signup
    );

    app.post('/api/auth/signin', [updateLoginAttempts], controller.signin);
    app.post("/api/auth/signout", controller.signout);

    // The error message suggests that there might be a misplaced `.get()` method, so make sure that there's no such method here
};
