'use strict';
const express = require('express');
const app = express();
const router = express.Router();

const google = require('./google');
const facebook = require('./facebook');
const basic = require('./basic');

module.exports = (app) => {
    router.post('/api/v1/auth/google', (req, res) => {
        google.authenticate(req,res);
    });
    router.post('/api/v1/auth/facebook', (req, res) => {
        facebook.authenticate(req,res);
    });
    router.post('/api/v1/auth/login', (req, res) => {
        basic.authenticate(req,res);
    });
    app.use(router);
};



