'use strict';
const express = require('express');
const app = express();
const router = express.Router();
const restify = require('express-restify-mongoose');

const contracts = require('./model/contract.model');
const users = require('./model/user.model');


module.exports = (app) => {
    restify.serve(router, contracts.model, contracts.options);
    restify.serve(router, users.model, users.options);    
    app.use(router);
};



