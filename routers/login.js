const router = require('express').Router();
const passport = require('./../passport/passporthandler');

router.post('/', passport.authenticate('local'), function (req, res) {

        res.send({success: 'true', name: req.user.name, url: '/library'});
    }
);

module.exports = router;

