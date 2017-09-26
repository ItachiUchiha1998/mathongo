const BearerStrategy = require('passport-http-bearer').Strategy;
const models = require('./../../../db/models').models;

module.exports = new BearerStrategy(function (token, done) {
    if (token === null || token === undefined) {
        return done(null, false, {message: 'Could not authorize'});
    }
    models.AuthToken.findOne({
        where: {
            token: token
        },
        include: [{
            model: models.UserLocal,
            include: [models.Student, models.Tutor, models.Admin]
        }]
    }).then(function (authToken) {
        // console.log(authToken.get());
        if (authToken && authToken.userlocal.student) {
            return done(null, {role: "Student", user: authToken.userlocal.student});
        }
        else if (authToken && authToken.userlocal.tutor) {
            return done(null, {role: "Tutor", user: authToken.userlocal.tutor});
        }
        else if (authToken && authToken.userlocal.admin) {
            return done(null, {role: "Admin", user: authToken.userlocal.admin});
        }
        else {
            return done(null, false, {message: 'Could not authorize'})
        }
    }).catch(function (err) {
        console.log(err);
        return done(err, false);
    })
});