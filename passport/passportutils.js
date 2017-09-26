function ensureLogin() {

    return function (req, res, next) {

        if (!req.user.user) {
            res.send({url:'/', message: "user not logged in"});
        } else {
            next();
        }
    }
}


function ensureStudent() {
    return function (req, res, next) {

        if (req.user.user && req.user.role === 'Student') {
            next();
        } else {
            res.send({success: 'false', url: '/', message: "Student Only"});
        }
    }
}

function ensureTutor() {
    return function (req, res, next) {

        if (req.user.user && req.user.role === 'Tutor') {
            next();
        } else {
            res.send({success: 'false', url: '/', message: "Tutor Only"});
        }
    }
}

function ensureAdmin() {
    return function (req, res, next) {
        if (req.user.user && req.user.role === 'Admin') {
            next();
        } else {
            res.send({success: 'false', url: '/', message: "Admin Only"});
        }
    }
}

module.exports = {
    ensureLogin,
    ensureTutor,
    ensureAdmin,
    ensureStudent
}
