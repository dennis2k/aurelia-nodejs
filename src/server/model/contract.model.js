const mongoose = require('mongoose')

var model = mongoose.model('contract', new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true }
}));

var options = {
    postCreate: function (req, res, next) {
        const result = req.erm.result         // unfiltered document, object or array
        const statusCode = req.erm.statusCode // 200
        next();
    },
    preRead: function (req, res, next) {
        next()
    },
    onError: function (err, req, res, next) {
        const statusCode = req.erm.statusCode // 400 or 404
        res.status(statusCode).json({
            message: err.message
        })
    }
}

exports.model = model;
exports.options = options;