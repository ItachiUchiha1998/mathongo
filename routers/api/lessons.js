const router = require('express').Router();
const models = require('./../../db/models').models;
const password = require('./../../utils/password');
const passport = require('./../../passport/passporthandler');
const ensure = require('./../../passport/passportutils');


router.get('/:id', function (req, res) {
  //get the lecture of this id
  let lessonId = req.params.id;
  models.Lesson.findOne({
    where: {
      id: lessonId
    },
      include: [models.Upvote]
  }).then(function (lesson) {
      console.log("******************")
      console.log(lesson)
      console.log("*******************")
    models.Enrollment.findOne({
      where: {
        studentId: req.user.user.id,
        minicourseId: lesson.minicourseId
      }
    }).then(function (enrollment) {
      if (enrollment) {
          let finalLesson = lesson.get();
          finalLesson.upvotes = finalLesson.upvotes.length;
        res.send({success: 'true', lesson: finalLesson})
      } else {
        res.send({success: 'false', miniCourseId: lesson.minicourseId})
      }
    }).catch(function (err) {
      console.log(err);
      res.send("Could not get this lesson right now");
    })
  }).catch(function (err) {
    console.log(err);
    res.send("Could not get this lesson right now");
  })
});

router.post('/:id/bookmark',  passport.authenticate('bearer'),ensure.ensureStudent(),function (req, res) {
  let lessonId = parseInt(req.params.id);
  models.Bookmark.create({
    lessonId: lessonId,
    studentId: req.user.user.id
  }).then(function (bookmark) {
    if (bookmark) {
      res.send({success: 'true'})
    } else {
      res.send({success: 'false'})
    }
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'error'})
  });
});


router.get('/:id/isBookmarked', passport.authenticate('bearer'), function (req, res) {
  let lessonId = parseInt(req.params.id);
  models.Bookmark.findOne({
    where: {
      lessonId: lessonId,
      studentId: req.user.user.id
    }
  }).then(function (enrollment) {
    if (enrollment) {
      res.send({isBookmarked: 'true'});
    } else {
      res.send({isBookmarked: 'false'});
    }
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'false', message: 'Could not get the bookmark right now'})
  })
});


router.post('/:lessonId/report',passport.authenticate('bearer'), ensure.ensureStudent(), function (req, res) {
  //report this lesson

    let lessonId = parseInt(req.params.lessonId);
    models.Report.create({
        lessonId: lessonId,
        studentId: req.user.user.id,
        description: req.body.description
    }).then(function (report) {
        if (report) {
            res.send({success: 'true'})
        } else {
            res.send({success: 'false', message: 'Could not report for this lesson'})
        }
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'false', message: 'Could not find the lesson'})
    });
});

router.post('/:lessonId/upvote', passport.authenticate('bearer'), ensure.ensureStudent(),function (req, res) {
  //upvote this lesson
    let lessonId = parseInt(req.params.lessonId);
    models.Upvote.create({
        lessonId: lessonId,
        studentId: req.user.user.id,
    }).then(function (upvote) {
        if (upvote) {
            res.send({success: 'true'})
        } else {
            res.send({success: 'false', message: 'Could not upvote this lesson'})
        }
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'false', message: 'Could not find the lesson'})
    });

});

router.get('/:id/isUpvoted', passport.authenticate('bearer'), function (req, res) {
    let lessonId = parseInt(req.params.id);
    models.Upvote.findOne({
        where: {
            lessonId: lessonId,
            studentId: req.user.user.id
        }
    }).then(function (upvote) {
        if (upvote) {
            res.send({success: 'true', message: 'upvoted'});
        } else {
            res.send({success: 'false' , message: 'not upvoted'});
        }
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'false', message: 'Error'})
    })
});


//TODO DELETE LESSON
router.delete('/:id',  passport.authenticate('bearer'),ensure.ensureAdmin(), function (req, res) {
  let lessonId = parseInt(req.params.id);
  models.Lesson.destroy({
    where: {id: lessonId}
  }).then(function (noOfLessonsDeleted) {
    if (noOfLessonsDeleted !== 0) {
      models.Bookmark.destroy({
        where: {lessonId: lessonId}
      }).then(function (noOfBookmarksDeleted) {
        models.Report.destroy({
          where: {lessonId: lessonId}
        }).then(function (noOfReportsDeleted) {
          models.Upvote.destroy({
            where: {lessonId: lessonId}
          }).then(function (noOfUpvotesDeleted) {
            res.send({
              success: 'true',
              noOfLessonsDeleted,
              noOfBookmarksDeleted,
              noOfReportsDeleted,
              noOfUpvotesDeleted,
            });
          }).catch(function (err) {
            console.log(err);
            res.send("Could not delete the Upvotes");
          })
        }).catch(function (err) {
          console.log(err);
          res.send("Could not delete the Reports");
        })

      }).catch(function (err) {
        console.log(err);
        res.send("Could not delete the Bookmarks");
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.send("Could not delete the Lessons");
  });
});

router.put('/:id',  passport.authenticate('bearer'),ensure.ensureAdmin(), function (req, res) {
  let lessonId = parseInt(req.params.id);
  models.Lesson.update({
    name: req.body.name,
    videoUrl: req.body.videoUrl,
    level: req.body.level,
    duration: req.body.duration,
    description: req.body.description
  }, {
    where: {id: lessonId}
  }).then(function (count) {
    if (count > 0) {
      res.send({success:'true'});
    } else {
      res.send({success:'false'});
    }
  }).catch(function (err) {
    console.log(err);
    res.send("Could not delete the Lessons");
  });
});

module.exports = router;
