const {authJwt} = require("../middlewares");
const controller = require("../controllers/gallery.controller");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
        next();
    });

    // // Create a new gallery , [authJwt.verifyToken],
    app.post("/api/galleries", controller.createGallery);

    // Retrieve all galleries
    app.get("/api/galleries", controller.getAllGallery);

    // Retrieve a single gallery with id
    // app.get(
    //     "/api/galleries/:id",
    //     // [authJwt.verifyToken],
    //     controller.getGalleryById
    // );

    // // Update a gallery with id
    // app.put("/api/galleries/:id", [authJwt.verifyToken], controller.updateGallery);

    // Delete a gallery with id
    // app.deleteGallery(
    //   "/api/galleries/:id",
    //   [authJwt.verifyToken],
    //   controller.deleteGallery
    // );
};
