const LocalStrategy = require('passport-local').Strategy;
const models = require('./../../../db/models').models;
const passutils = require('./../../../utils/password');

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    models.UserLocal.findOne({
        where: {email: email},
        include: [models.Student, models.Tutor, models.Admin]
    }).then(function (user) {
        if (!user)
            return done(null, false, {message: 'Incorrect email'});
        passutils.compare2hash(password, user.password).then(function (match) {
            if (match && user.student) {
                return done(null, {role: "Student", user: user.student});
            }
            else if (match && user.tutor) {
                return done(null, {role: "Tutor",user: user.tutor});
            }
            else if (match && user.admin) {
                return done(null, {role: "Admin",user: user.admin});
            }
            else {
                return done(null, false, {message: 'Incorrect password'});
            }
        }).catch(function (err) {
            console.log(err);
            return done(err, false, {message: err})
        });

    }).catch(function (err) {
        console.log(err);
        return done(err, false, {message: 'invalid user'});
    });

});

