'use strict';
var request = require('request');
var util = require('./../util');
var config = require('./../config');
var user = require('./../model/user.model').model;

exports.authenticate = (req, res) => {
    var accessTokenUrl = config.FACEBOOK_TOKEN_URL;
    var graphApiUrl = config.FACEBOOK_GRAPH_URL;
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.FACEBOOK_CLIENT_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, (err, response, accessToken) => {
        if (response.statusCode !== 200) {
            return res.status(500).send({ message: accessToken.error.message });
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, (err, response, profile) => {
            if (err) {
                return util.handleError(err, res, "Error auth with facebook " + err)
            }
            user.findOne({ facebook: profile.id }, (err, existingUser) => {
                if (err) 
                    return util.handleError(err, res, "Error finding user " + err)                
                if (existingUser) 
                    return res.send({ user: existingUser, token: util.tokenize(existingUser) });

                let newUser = new user();
                newUser.facebook = profile.id;
                newUser.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                newUser.displayName = profile.name;
                newUser.save((err) => {
                    if (err) {
                        return util.handleError(err, res, "Error saving user" + err)
                    }
                    let token = util.tokenize(newUser);
                    res.send({ user: newUser, token: token });
                });
            });

        });
    });
}