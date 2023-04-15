const {authJwt} = require("../middlewares");
const controller = require("../controllers/article.controller");
// https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
        next();
    });

    // // Create a new article , [authJwt.verifyToken],
    app.post("/api/articles", controller.createArticle);

    // Retrieve all articles
    app.get("/api/articles", controller.getAllArticles);

    // Retrieve a single article with id
    app.get(
        "/api/articles/:id",
        // [authJwt.verifyToken],
        controller.getArticleById
    );

    // // Update a article with id
    // app.put("/api/articles/:id", [authJwt.verifyToken], controller.updateArticle);

    // Delete a article with id
    // app.deleteArticle(
    //   "/api/articles/:id",
    //   [authJwt.verifyToken],
    //   controller.deleteArticle
    // );
};
