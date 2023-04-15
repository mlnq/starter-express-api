const Article = require("../models/article.model");

// GET /api/articles
exports.getAllArticles = (req, res) => {
    Article.find().exec((err, articles) => {
        console.log("articles")
        if (err) {
            return res.status(500).send({article: err});
        }

        res.status(200).send(articles);
    });
};

// GET /api/articles/:id
exports.getArticleById = (req, res) => {
    const id = req.params.id;

    Article.findById(id).exec((err, article) => {
        if (err) {
            return res.status(500).send({article: err});
        }

        if (!article) {
            return res.status(404).send({article: "Article not found"});
        }

        res.status(200).send(article);
    });
};

// POST /api/articles
exports.createArticle = (req, res) => {
    const {user_id, title, content, author, featuredImage, isPublished, gallery_id} = req.body;

    if (!user_id || !title || !content || !author || !featuredImage) {
        return res.status(400).send({article: "Missing required fields"});
    }

    const article = new Article({user_id, title, content, author, featuredImage, isPublished, gallery_id});

    article.save((err, article) => {
        if (err) {
            return res.status(500).send({article: err});
        }

        res.status(201).send({article});
    });
};

// PUT /api/articles/:id
exports.updateArticle = (req, res) => {
    const id = req.params.id;

    Article.findByIdAndUpdate(
        id,
        req.body,
        {new: true, useFindAndModify: false},
        (err, article) => {
            if (err) {
                return res.status(500).send({article: err});
            }

            if (!article) {
                return res.status(404).send({article: "Article not found"});
            }

            res.status(200).send({article});
        }
    );
};

// DELETE /api/articles/:id
exports.deleteArticle = (req, res) => {
    const id = req.params.id;

    try {
        const data = Article.findByIdAndDelete(id);
        res.send(`Document with ${data.content} has been deleted..`);
    } catch (error) {
        res.status(400).json({article: error.article});
    }
};
