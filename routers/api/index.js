const router = require('express').Router();
const ensure = require('./../../passport/passportutils');
const passport = require('./../../passport/passporthandler');

router.use('/minicourses', require('./minicourses'));
router.use('/lessons', passport.authenticate('bearer'), require('./lessons'));
router.use('/students', passport.authenticate('bearer'), require('./students'));
//TODO : Add ensure admin
router.use('/tutors', require('./tutors'));
router.use('/extra', require('./extra'));
router.use('/reviews', require('./reviews'));

module.exports = router;