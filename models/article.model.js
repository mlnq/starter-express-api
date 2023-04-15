const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    featuredImage: {
        type: String,
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    gallery_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gallery",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
