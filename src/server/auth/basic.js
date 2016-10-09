'use strict';
var request = require('request');
var util = require('./../util');
var config = require('./../config');
var user = require('./../model/user.model').model;

exports.authenticate = (req, res) => {
    let _user;
    user.findOne({ email: req.body.email }, '+password')
        .then((existingUser) => {
            if (!existingUser) {
                return util.unauthorizedResponse(res, "Wrong email / password");
            }
            _user = existingUser;
            return existingUser.comparePassword(req.body.password, existingUser.password)
        })
        .then(isMatch => {
            if (!isMatch) {
                return util.unauthorizedResponse(res, "Wrong email / password");
            }
            return res.send({ user: _user, token: util.tokenize(_user) });
        })
        .catch((err) => {
            return util.unauthorizedResponse(res, "Wrong email / password",err);            
        });
};