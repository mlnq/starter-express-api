const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.article = require("./article.model");
db.gallery = require("./gallery.model");

module.exports = db;
