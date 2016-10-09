'use strict'

var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('./config');

exports.methodNotAllowedResponse = (res) => {
    return res.status(405).send({
        message: "Method not allowed"
    })
}

exports.successResponse = (res, message, data) => {
    return res.status(200).send({
        success: true,
        message: message,
        data: data
    })
}

exports.handleError = (err, res, message) => {
    if (err) {
        console.log(err)
        return res.status(400).send({ message: message });
    }
}

exports.unauthorizedResponse = (res, message, err) => {
    if(err) {
        console.log(err)
    }
    return res.status(401).send({
        message: message || "Unauthorized"
    })
}

exports.resourceNotFoundResponse = (res) => {
    return res.status(404).send({
        message: "Resource not found"
    })
}

exports.tokenize = (user) => {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}