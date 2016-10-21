var express  = require('express');
var router   = express.Router();
let passport = require('passport');
let jwt      = require('jsonwebtoken');
var User     = require('../models/user');
let config   = require('../config');
let util     = require('util');
let auth     = require('../auth');

//-------------------------------------------
// Register new users
//-------------------------------------------

router.post('/register', function (req, res) {

    req.checkBody('name', 'Invalid name').notEmpty().isAlpha();
    req.checkBody('user', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    req.checkBody('role', 'Invalid role').notEmpty().isAlpha();

    var errors = req.validationErrors();
    if (errors) {
        res.json({
            success: false,
            message: 'There have been validation errors: ' + util.inspect(errors)
        });
    }
    else {
        let newUser = new User({
            user    : req.body.user,
            password: req.body.password,
            name    : req.body.name,
            role    : req.body.role || 'user'
        });

        // Attempt to save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'That email address already exists.'
                });
            }
            res.json({
                success: true,
                message: 'Successfully created new user.'
            });
        });
    }
});

//-------------------------------------------
// Get all Users
//-------------------------------------------

router.get('/', auth.isAuthenticated, auth.allowedRoles(['admin']), function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

//-------------------------------------------
// Authenticate and generate JWT
//-------------------------------------------

router.post('/login', (req, res) => {

    req.checkBody('user', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.json({
            success: false,
            message: 'There have been validation errors: ' + util.inspect(errors)
        });

        return;
    }

    User.findOne({user: req.body.user}, function (err, user) {

        var success = {success: true, message: 'Authentication successfull'};
        var failed  = {success: false, message: 'Authentication failed'};

        if (err)
            throw err;

        if (!user)
            res.send(failed);
        else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user, config.auth.secret, {expiresIn: "2 hours"});

                    res.json({token: 'JWT ' + token, success});
                }
                else {
                    res.send(failed);
                }
            });
        }
    });
});


module.exports = router;