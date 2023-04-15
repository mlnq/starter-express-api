const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    files: [{
        type: String,
        required: false,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
