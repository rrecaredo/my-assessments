let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt  = require('passport-jwt').ExtractJwt;
let User        = require('./models/user');
let config      = require('./config');
let passport    = require('passport');

module.exports = () => {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(), // TODO: Crteate a custom cookie extractor
                                                     // Example : https://github.com/themikenicholson/passport-jwt#user-content-writing-a-custom-extractor-function
        secretOrKey   : config.auth.secret
    };

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({
            id: jwt_payload.id
        }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));

    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", false);
        },
    }
};

module.exports.allowedRoles = function(roles) {
    if (typeof roles === 'string') roles = [roles];

    return _middleware.bind(this);

    function _middleware(req, res, next) {
        let rol = req.user.role;

        console.log(roles.indexOf(rol));

        if (roles.indexOf(rol) > -1)
            return next();
        else
            throw new Error('Unauthorizedf');
    }
}

module.exports.isAuthenticated = passport.authenticate('jwt', { session: false });