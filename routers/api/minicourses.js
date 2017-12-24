const router = require('express').Router();
const models = require('./../../db/models').models;
const password = require('./../../utils/password');
const passport = require('./../../passport/passporthandler');
const ensure = require('./../../passport/passportutils');
const bodyParser = require('body-parser');
var fs = require('fs');
var express = require('express');
var path = require('path');
var multer = require('multer');
var checked = false;

router.use(bodyParser.json());
router.use(express.static(path.join(__dirname, 'public_html')));

router.get('/', function (req, res) {

  models.MiniCourse.findAll({
    include: [
      {
        model: models.Tutor
      },
      {
        model: models.Tag,
        include: [models.Class, models.Subject, models.Course]
      },
      {
        model: models.MiniCourseCategory,
        include: [models.Category]
      }],
      order: [
            ['id', 'DESC'],
        ],
  }).then(function (miniCourses) {
    res.send(miniCourses);
  }).catch(function (err) {
    console.log(err);
    res.send("Could not send all the minicourses");
  })
});

router.get('/:id', function (req, res) {
  //get a particular minicourse along all its lectures
  //Get All Tags
  let miniCourseId = parseInt(req.params.id);
  models.MiniCourse.findOne({
    where: {id: miniCourseId},
    include: [
      {
        model: models.Lesson,
        include: models.Upvote
      },
      {
        model: models.Tutor
      },
      {
        model: models.Tag,
        include: [models.Class, models.Subject, models.Course]
      },
      {
        model: models.MiniCourseCategory,
        include: [models.Category]
      },
      {
        model: models.Review,
        include: [models.Student]
      }
    ],
    order: [
      [
        models.Lesson, 'id'
      ]
    ]
  }).then(function (miniCourse) {

    //Write for enrollment
    let finalMiniCourse = miniCourse.get();
    console.log("**********")
    console.log(finalMiniCourse.lessons);
    console.log("**********")
    finalMiniCourse.lessons = finalMiniCourse.lessons.map((lesson) => {
      let finalLesson = lesson.get();
      finalLesson.upvotes = finalLesson.upvotes.length;
      return finalLesson;
    })
    res.send(finalMiniCourse);
  }).catch(function (err) {
    console.log(err);
    res.send("Could not get this minicourse right now");
  })
});

router.post('/withFilters', function (req, res) {
  if (!req.body.hasOwnProperty('filter')) {
    models.MiniCourse.findAll({
      include: [
        {
          model: models.Tutor
        },
        {
          model: models.Tag,
          include: [models.Class, models.Subject, models.Course]
        },
        {
          model: models.MiniCourseCategory,
          include: [models.Category]
        }]
    }).then(function (minicourses) {
      return res.send(minicourses);
    }).catch(function (err) {
      console.log(err);
      return res.send("Could not get the minicourses right now")
    })
  } else {
    console.log(req.body.filter);
    // let classArray = req.body.filter.hasOwnProperty('classObject') ? req.body.filter.classObject.map(parseInt) : [0],
    //     subjectArray = req.body.filter.hasOwnProperty('subjectObject') ? req.body.filter.subjectObject.map(parseInt) : [0],
    //     categoryArray = req.body.filter.hasOwnProperty('categoryObject') ? req.body.filter.categoryObject.map(parseInt) : [0],
    let difficultyArray = req.body.filter.hasOwnProperty('difficultyObject') ? req.body.filter.difficultyObject : [''],
      mediumArray = req.body.filter.hasOwnProperty('mediumObject') ? req.body.filter.mediumObject : [''];
    //
    // console.log(classArray);
    //
    // for (let i = 0; i < difficultyArray.length; i++) {
    //     difficultyArray[i] = difficultyArray[i] === '1' ? 'Beginner' : difficultyArray[i] === '2' ? 'Intermediate' : difficultyArray[i] === '3' ? 'Advance' : '';
    // }

    // for (let i = 0; i < mediumArray.length; i++) {
    //     mediumArray[i] = mediumArray[i] === '1' ? 'English' : mediumArray[i] === '1' ? 'Hindi' : '';
    // }


    let options = {};
    if (req.body.filter.hasOwnProperty('classObject')) {
      options['$tag.classId$'] = {$in: req.body.filter.classObject.map(Number)};
    }

    if (req.body.filter.hasOwnProperty('subjectObject')) {
      options['$tag.subjectId$'] = {$in: req.body.filter.subjectObject.map(Number)};
    }

    if (req.body.filter.hasOwnProperty('courseObject')) {
      options['$tag.courseId$'] = {$in: req.body.filter.courseObject.map(Number)};
    }

    if (req.body.filter.hasOwnProperty('categoryObject')) {
      options['$minicoursecategories.categoryId$'] = {$in: req.body.filter.categoryObject.map(Number)};
    }

    if (req.body.filter.hasOwnProperty('mediumObject')) {
      options['medium'] = {$in: mediumArray};
    }

    if (req.body.filter.hasOwnProperty('difficultyObject')) {
      options['level'] = {$in: difficultyArray};
    }

    console.log("###############");
    console.log(options);
    models.MiniCourse.findAll({
      where: options
      // '$tags.classId$': classArray.indexOf(0) === 0 ? {$notIn: [0]} : {$in: classArray},
      // '$tags.subjectId$': subjectArray.indexOf(0) === 0 ? {$notIn: [0]} : {$in: subjectArray},
      // '$tags.categoryId$': categoryArray.indexOf(0) === 0 ? {$notIn: [0]} : {$in: categoryArray},
      // medium: mediumArray[0].length === 0 ? {$notIn: ['']} : {$in: mediumArray},
      // level: difficultyArray[0].length === 0 ? {$notIn: ['']} : {$in: difficultyArray}
      ,
      include: [
        {
          model: models.Tutor
        },
        {
          model: models.Tag,
          include: [models.Class, models.Subject, models.Course]
        },
        {
          model: models.MiniCourseCategory,
          include: [models.Category]
        }
      ]
    }).then(function (miniCourses) {
      console.log("************");
      miniCourseIds = miniCourses.map((i) => i.id);
      models.MiniCourse.findAll({
        where: {
          id: {$in: miniCourseIds}
        },
        include: [
          {
            model: models.Tutor
          },
          {
            model: models.Tag,
            include: [models.Class, models.Subject, models.Course]
          },
          {
            model: models.MiniCourseCategory,
            include: [models.Category]
          }]
      }).then(function (finalMiniCourses) {
        res.send(finalMiniCourses);
      }).catch(function (err) {
        console.log(err);
        res.send("Could not send all the minicourses");
      })
    }).catch(function (err) {
      console.log(err);
      res.send("Could not send all the minicourses");
    })
  }
});

router.post('/:id/addLesson', passport.authenticate('bearer'), ensure.ensureAdmin(), function (req, res) {
  let miniCourseId = parseInt(req.params.id);
  models.Lesson.create({
    name: req.body.name,
    videoUrl: req.body.videoUrl,
    level: req.body.level,
    duration: req.body.duration,
    description: req.body.description,
    minicourseId: miniCourseId
  }).then(function (lesson) {
    if (lesson) {
      res.send({
        success: "true"
      })
    }
    else {
      res.send({success: "false", msg: "Could not add the lesson right now"});
    }
  }).catch(function (err) {
    console.log(err);
    res.send({success: "false", msg: "Could not add the lesson right now"});
  })
})

router.post('/:id/enroll', passport.authenticate('bearer'), ensure.ensureStudent(), function (req, res) {
  //enroll in a minicourse
  let miniCourseId = parseInt(req.params.id);
  models.Enrollment.findOne({ where:{
      minicourseId:miniCourseId, 
      studentId:req.user.user.id
    }
  }).then(enroll=> {
    if(enroll) {
      console.log('already enrolled');
      res.send({success: 'already enrolled'});
    } else {
          models.Enrollment.create({
          minicourseId: miniCourseId,
          studentId: req.user.user.id
        }).then(function (enroll) {
          if (enroll) {
            res.send({success: 'true'})
          } else {
            res.send({success: 'false'})
          }
      }).catch(function (err) {
        console.log(err);
        res.send({success: 'error'})
      });
    }
  })

});

router.get('/:id/isEnrolled', passport.authenticate('bearer'), function (req, res) {
  let miniCourseId = parseInt(req.params.id);
  models.Enrollment.findOne({
    where: {
      minicourseId: miniCourseId,
      studentId: req.user.user.id
    }
  }).then(function (enrollment) {
    if (enrollment) {
      res.send({isEnrolled: 'true'});
    } else {
      res.send({isEnrolled: 'false'});
    }
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'false', message: 'Could not get the enrollments right now'})
  })
});
//Ask
router.post('/:minicourse/review', passport.authenticate('bearer'), function (req, res) {
  //review this minicourse
  //PHASE 2
});

router.delete('/:id', passport.authenticate('bearer'), ensure.ensureAdmin(), function (req, res) {
  let miniCourseId = parseInt(req.params.id);
  models.MiniCourse.destroy({
    where: {id: miniCourseId}
  }).then(function (noOfMiniCoursesDeleted) {
    if (noOfMiniCoursesDeleted !== 0) {
      models.Lesson.destroy({
        where: {minicourseId: miniCourseId}
      }).then(function (noOfLessonsDeleted) {
          models.Enrollment.destroy({
            where: {minicourseId: miniCourseId}
          }).then(function (noOfEnrollmentsDeleted) {
            models.Review.destroy({
              where: {minicourseId: miniCourseId}
            }).then(function (noOfReviewsDeleted) {
              models.Tag.destroy({
                where: {minicourseId: miniCourseId}
              }).then(function (noOfTagsDeleted) {
                models.MiniCourseCategory.destroy({
                  where: {minicourseId: miniCourseId}
                }).then(function (noOfMiniCourseCategoriesDeleted) {
                  res.send({
                    success: 'true',
                    noOfMiniCoursesDeleted,
                    noOfLessonsDeleted,
                    noOfEnrollmentsDeleted,
                    noOfReviewsDeleted,
                    noOfTagsDeleted,
                    noOfMiniCourseCategoriesDeleted
                  });
                }).catch(function (err) {
                  console.log(err);
                  res.send("Could not delete the MiniCourse Categories");
                })
              }).catch(function (err) {
                console.log(err);
                res.send("Could not delete the Tags");
              })
            }).catch(function (err) {
              console.log(err);
              res.send("Could not delete the Reviews");
            })
          }).catch(function (err) {
            console.log(err);
            res.send("Could not delete the Enrollments");
          })
        }
      ).catch(function (err) {
        console.log(err);
        res.send("Could not delete the Lessons");
      })
    }
  }).catch(function (err) {
    console.log(err);
    res.send("Could not delete the minicourse");
  })
});

router.get('/:id/material', passport.authenticate('bearer'), function (req, res) {
  let miniCourseId = parseInt(req.params.id);
  
  fs.readdir('./public_html/uploads/' + miniCourseId, function(err, data){
  if (err) return res.send(null);
  res.send(data);
});

});

router.get('/resources', passport.authenticate('bearer'), function (req, res) {
  fs.readdir('./public_html/resources/' , function(err, data){
    if (err) return res.send(null);
      res.send(data);
  });

});


/*
router.post('/:id/upload', passport.authenticate('bearer'), ensure.ensureAdmin(),function(req,res) {
  let miniCourseId = parseInt(req.params.id);
  
  //var material = req.body.material;
  //var material = 'string';
  
  var name = req.body.name;
  var pdf = req.body.material;
  var pdf = pdf.replace('data:application/pdf;base64,', '');
  
  console.log("Upload api called + " + miniCourseId);
  fs.writeFile('./public_html/uploads/'+miniCourseId+'/'+name,pdf, 'base64', function(err){
        if (err) {
          return res.send(err);
        }
        res.send({success : 'true'});
        console.log('file uploaded successfully');
    });
});
*/
module.exports = router;