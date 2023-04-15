const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
//
// const User = mongoose.model(
//     "User",
//     new mongoose.Schema({
//         username: String,
//         email: String,
//         password: String,
//         loginAttempts: {type: Number, default: 0},
//         lastFailedLogin: {type: Date},
//         lastSuccessfulLogin: {type: Date},
//         failedLoginSinceLastSuccess: {type: Number, default: 0},
//     }, {timestamps: true})
// );
// userSchema.methods.comparePassword = function (candidatePassword, callback) {
//     bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
//         if (err) return callback(err);
//         callback(null, isMatch);
//     });
// };
// module.exports = User;

const userSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        loginAttempts: {type: Number, default: 0},
        lastFailedLogin: {type: Date},
        lastSuccessfulLogin: {type: Date},
        failedLoginSinceLastSuccess: {type: Number, default: 0},
        failedLoginLock: {type: Boolean, default: true},
        blockedUntil: {type: Date, default: null},
    },
    {timestamps: true}
);

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
