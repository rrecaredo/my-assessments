const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
let bcrypt     = require('bcryptjs');

var UserSchema = new Schema({
    name    : {
        type    : String,
        required: true
    },
    user   : {
        type     : String,
        lowercase: true,
        unique   : true,
        required : true
    },
    password: {
        type    : String,
        required: true
    },
    role    : {
        type    : String,
        required: false,
        default : 'user'
    }
});

//-----------------------------------------------
// Encrypt password before saving it
//-----------------------------------------------

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }

                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

//-----------------------------------------------
// Compare Hashed passwords
//-----------------------------------------------

UserSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);