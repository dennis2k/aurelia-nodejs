'use strict';
var request = require('request');
var util = require('./../util');
var config = require('./../config');
var user = require('./../model/user.model').model;

exports.authenticate = (req, res) => {
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_CLIENT_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: config.GOOGLE_GRANT_TYPE
  };

  // Step 1. Exchange authorization code for access token.
  request.post(config.GOOGLE_TOKEN_URL, { json: true, form: params }, (err, response, token) => {
    if (err)
      util.handleError(err, res, "Failed authenticating with google: " + err)
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: config.GOOGLE_PEOPLE_URL, headers: headers, json: true }, (err, response, profile) => {
      if (err)
        util.handleError(err, res, "Failed fetching google info")

      user.findOne({ google: profile.sub }, (err, existingUser) => {
        if (existingUser) {
          return res.send({ user: existingUser, token: util.tokenize(existingUser) });
        }
        var newUser = new user();
        newUser.google = profile.sub;
        newUser.picture = profile.picture.replace('sz=50', 'sz=200');
        newUser.displayName = profile.name;
        newUser.save((err) => {
          if (err) {
            util.handleError(err, res, "Error saving user" + err)
          }
          var token = util.tokenize(newUser);
          res.send({ user: newUser, token: token });
        });
      });
    });
  });
}