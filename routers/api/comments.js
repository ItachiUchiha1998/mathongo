const router = require('express').Router();
const models = require('./../../db/models').models;
const password = require('./../../utils/password');
const passport = require('./../../passport/passporthandler');
const ensure = require('./../../passport/passportutils');

router.get('/:miniCourseId', function (req, res) {
  let miniCourseId = req.params.miniCourseId;
  models.Comment.findAll({
    where: {minicourseId: miniCourseId}
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

router.post('/:miniCourseId', passport.authenticate('bearer'), ensure.ensureStudent(), function (req, res) {
  let miniCourseId = req.params.miniCourseId;
  models.Comment.create({
    rating: (parseInt(req.body.rating)),
    description: req.body.description,
    minicourseId: miniCourseId,
    studentId: req.user.user.id
  }).then(function (comment) {
    if (comment) {
      res.send({success: true, comment: comment})
      models.MiniCourse.findOne({
        where: {id: miniCourseId}
      }).then(function (minicourse) {
        let totalRating = minicourse.noOfRatings * minicourse.rating;
        minicourse.noOfRatings++;
        let finalRating = ((totalRating + (+req.body.rating)) / minicourse.noOfRatings);
        if (req.body.description) {
          minicourse.noOfReviews++;
        }
        minicourse.save();
        models.MiniCourse.update({
          rating: finalRating
        }, {
          where: {id: miniCourseId}
        }).then(function () {

        }).catch(function (err) {
          console.log(err);
        })

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
