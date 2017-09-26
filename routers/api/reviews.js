const router = require('express').Router();
const models = require('./../../db/models').models;
const password = require('./../../utils/password');
const passport = require('./../../passport/passporthandler');
const ensure = require('./../../passport/passportutils');

router.get('/:miniCourseId', function (req, res) {
  let miniCourseId = req.params.miniCourseId;
  models.Review.findAll({
    where: {minicourseId: miniCourseId}
  }).then(function (reviews) {
    if (reviews) {
      res.send({success: true, reviews: reviews.map((review => review.get()))})
    } else {
      res.send({success: false})
    }
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'error', message: "Could not get the reviews right now"});
  })
});

router.post('/:miniCourseId', passport.authenticate('bearer'), ensure.ensureStudent(), function (req, res) {
  let miniCourseId = req.params.miniCourseId;
  models.Review.create({
    rating: (parseInt(req.body.rating)),
    description: req.body.description,
    minicourseId: miniCourseId,
    studentId: req.user.user.id
  }).then(function (review) {
    if (review) {
      res.send({success: true, review: review})
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
    res.send({success: 'error', message: "Could not get the review right now"});
  })
});

module.exports = router;
