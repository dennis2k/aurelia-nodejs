'use strict'

const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true },
    password: { type: String, select: false },
    displayName: String,
    picture: String,
    facebook: String,
    foursquare: String,
    google: String,
    github: String,
    linkedin: String,
    live: String,
    yahoo: String,
    twitter: String
})
userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = (password, currentPassword) => {
    return new Promise((resolve, reject) => {
            bcrypt.compare(password, currentPassword, (err, isMatch) => {
                (err) ? reject(err) : resolve(isMatch) 
        });  
    }); 
};

var model = mongoose.model('user',userSchema);
var options = {
    onError: function (err, req, res, next) {
        const statusCode = req.erm.statusCode // 400 or 404
        res.status(statusCode).json({
            message: err.message
        })
    }
}

exports.model = model;
exports.options = options;
exports.create = () => {
    return new model();
}