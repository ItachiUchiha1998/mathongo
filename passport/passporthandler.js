const passport = require('passport');

const localStrategy = require('./strategies/local/localstrategy');
const bearerStrategy = require('./strategies/bearer/bearerstrategy');


passport.serializeUser(function (user, cb) {
    return cb(null, {key: user.user.id, role: user.role});
});


passport.deserializeUser(function (userObj, cb) {
    if (userObj && userObj.role) {
        models[userObj.role].findByPrimary(userObj.key).then(function (user) {
            return cb(null, {role: userObj.role,user: user});
        }).catch(function (err) {
            console.log(err);
            cb(err, false);
        })

    }
    // if (user.role === 'Student') {
    //     models.Student.findByPrimary(user.key).then(function (student) {
    //         return cb(null, student);
    //     }).catch(function (err) {
    //         console.log(err);
    //         cb(err, false);
    //     })
    //
    // } else if (user.role === 'Tutor') {
    //     models.Tutor.findByPrimary(user.key).then(function (tutor) {
    //         return cb(null, tutor);
    //     }).catch(function (err) {
    //         console.log(err);
    //         cb(err, false);
    //     })
    //
    // } else if (user.role === 'Admin') {
    //     models.Admin.findByPrimary(user.key).then(function (admin) {
    //         return cb(null, admin);
    //     }).catch(function (err) {
    //         console.log(err);
    //         cb(err, false);
    //     })

    else {
        cb((new Error("Could not deserialize")), false);
    }

});


passport.use('local', localStrategy);
passport.use('bearer', bearerStrategy);

module.exports = passport;