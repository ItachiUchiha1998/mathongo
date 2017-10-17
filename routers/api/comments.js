const router = require('express').Router();
const models = require('./../../db/models').models;
const password = require('./../../utils/password');
const passport = require('./../../passport/passporthandler');
const ensure = require('./../../passport/passportutils');

router.get('/:lessonId', function (req, res) {
  let lessonId = req.params.lessonId;
  models.Comment.findAll({
    where: {lessonId: lessonId}
  }).then(function (comments) {
    if (comments) {
      res.send({success: true, comments: comments.map((comment => comment.get()))})
    } else {
      res.send({success: false})
    }
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'error', message: "Could not get the comments right now"});
  })
});

router.post('/:lessonId', passport.authenticate('bearer'), ensure.ensureStudent(), function (req, res) {
  let lessonId = req.params.lessonId;
  models.Comment.create({
    description: req.body.description,
    lessonId: lessonId,
    studentId: req.user.user.id
  }).then(function (comment) {
    if (comment) {
      res.send({success: true, comment: comment})
      models.Lesson.findOne({
        where: {id: lessonId}
      }).then(function (lesson) {
        if (req.body.description) {
          lesson.noOfComments++;
        }
        lesson.save();
      }).catch(function (err) {
        console.log(err);
      })
    } else {
      res.send({success: false})
    }
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'error', message: "Could not get the comment right now"});
  })
});

module.exports = router;
