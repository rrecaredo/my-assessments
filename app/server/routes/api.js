var express    = require('express');
var router     = express.Router();
const auth     = require('.,/auth')();
var Assessment = require('./models/assessment');

const api = () => {
    router.route('/assessments')
        .get((req, res) => {});

    router.route('/assessments/:id')
        .get((req, res) => {})
        .put((req, res) => {})
        .post((req, res) => {});

    return router;
};

module.exports = api;