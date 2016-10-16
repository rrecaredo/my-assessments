var express  = require('express');
var router   = express.Router();
let passport = require('passport');
let jwt      = require('jsonwebtoken');
var User     = require('../models/User');
let config   = require('../config');

//-------------------------------------------
// Register new users
//-------------------------------------------

router.post('/register', function (req, res) {
    if (!req.body.user || !req.body.password) {
        res.json({
            success: false,
            message: 'Please enter email and password.'
        });
    }
    else {
        let newUser = new User({
            email   : req.body.user,
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

router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

//-------------------------------------------
// Authenticate and generate JWT
//-------------------------------------------

router.post('/auth', (req, res) => {
    User.findOne({ email: req.body.user }, function (err, user) {

        var success = { success : true, message  : 'Authentication successfull' };
        var failed  = { success : false, message : 'Authentication failed' };

        if (err)
            throw err;

        if (!user)
            res.send(failed);
        else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user, config.auth.secret, { expiresIn: "2 hours" });

                    res.json(Object.assign(success, token));
                }
                else {
                    res.send(failed);
                }
            });
        }
    });
});


module.exports = router;