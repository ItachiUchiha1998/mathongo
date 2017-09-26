const router = require('express').Router();
const models = require('./../../db/models').models;
const password = require('./../../utils/password');
const ensure = require('./../../passport/passportutils');
const passport = require('./../../passport/passporthandler');

router.get('/', function (req, res) {
  models.Tutor.findAll().then(function (tutors) {
    if (tutors) {
      return res.send({success: 'true', data: tutors});
    } else {
      return res.send({success: 'false'});
    }
  }).catch(function (err) {
    console.log(err);
    return res.send({success: 'false'});
  })

});

router.post('/add', function (req, res) {
  if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
    res.send({success: "false", msg: "Insufficient Details"});
  }
  password.pass2hash(req.body.password).then(function (hash) {
    models.UserLocal.create({
      email: req.body.email,
      password: hash,
      role: "Tutor",
      tutor: {
        name: req.body.name,
        email: req.body.email,
        contact: req.body.contact,
        img: req.body.img,
        description: req.body.description
      }
    }, {
      include: [models.Tutor]
    }).then(function (userLocal) {
      if (userLocal) {
        res.send({success: 'true'});
      } else {
        res.send({success: 'false'})
      }
    }).catch(function (err) {
      console.log(err);
      res.send({success: 'passerror'});
    })
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'emailerror'});
  })
});


router.get('/:id', function (req, res) {
  models.Tutor.findOne({
    where: {id: req.params.id}
  }).then(function (student) {
    if (student) {
      res.send(student);
    } else {
      res.send({success: false, data: 'Tutor Does Not Exists'})
    }
  }).catch(function (err) {
    console.log(err);
    res.send('Unknown Student');
  })
});

router.put('/:id', function (req, res) {
  let tutorId = parseInt(req.params.id);

  models.Tutor.update({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact,
    img: req.body.img,
    description: req.body.description
  }, {
    where: {id: tutorId},
    returning: true
  }).then(function (rows) {
    if (rows[0] === 0) {
      res.send({success: false, data: 'Tutor Does Not Exists'})
    } else {
      res.send({success: true, data: rows[1][0].get()});
    }
  }).catch(function (error) {
    console.error(error);
    res.send({success: false, data: 'Internal Server Error'})
  });
});

router.delete('/:id', function (req, res) {
  let tutorId = parseInt(req.params.id);

  models.MiniCourse.findAll({
    where: {tutorId : tutorId}
  }).then(function (minicourses) {
      if(minicourses.length !== 0){
          res.send({success: false, data: 'Can not delete the tutor which has courses'})
      }else {
          models.Tutor.destroy({
              where: {id: tutorId},
              returning: true
          }).then(function (noOfTutorsDeleted) {
              if (noOfTutorsDeleted === 0) {
                  res.send({success: false, data: 'Tutor Does Not Exists'})
              } else {
                  res.send({success: true, data: 'Tutor Deleted'});
              }
          }).catch(function (error) {
              console.error(error);
              res.send({success: false, data: 'Internal Server Error'})
          });
      }
  }).catch(function (err) {
      console.log(err)
      res.send({success: false, data:"Internal Server Error"})
  })
});

router.get('/:id/myMiniCourses', function (req, res) {
  //tutor gets all his minicourses,
  const tutorId = parseInt(req.params.id);
  models.MiniCourse.findAll({
    where: {
      tutorId: tutorId
    }
  }).then(function (miniCourses) {
    res.send(miniCourses);
  }).catch(function (err) {
    console.log(err);
    res.send("Could not get the minicourses now");
  })

});

router.get('/:id/:miniCourse', function (req, res) {
  //tutor sees a minicourse with review on it
  //PHASE 2
});

router.get('/:id/:minicourse/:lesson', function (req, res) {
  //tutor sees a lesson with all its reports and no of upvotes
  //PHASE 2
});


router.post('/:id/addMiniCourse', passport.authenticate('bearer'), ensure.ensureAdmin(), function (req, res) {
  const tutorId = parseInt(req.params.id);
  models.MiniCourse.create({
    name: req.body.name,
    noOfLessons: req.body.noOfLessons,
    description: req.body.description,
    level: req.body.level,
    duration: req.body.duration,
    medium: req.body.medium,
    tutorId: tutorId
  }).then(function (miniCourse) {
    models.Class.findOne({
      where: {
        id: req.body.classId
      }
    }).then(function (classObject) {
      models.Subject.findOne({
        where: {
          id: req.body.subjectId
        }
      }).then(function (subjectObject) {
        models.Course.findOne({
          where: {
            id: req.body.courseId
          }
        }).then(function (courseObject) {
          models.Tag.create({
            classId: classObject.id,
            subjectId: subjectObject.id,
            courseId: courseObject.id,
            minicourseId: miniCourse.id
          }).then(function (tagRow) {
            let minicoursecategory = [];
            for (let i = 0; i < req.body.categoryIds.length; i++) {
              minicoursecategory.push({
                categoryId: req.body.categoryIds[i],
                minicourseId: miniCourse.id
              })
            }
            models.MiniCourseCategory.bulkCreate(minicoursecategory).then(function (minicourseCategories) {
              models.MiniCourse.findOne({
                where: {id: miniCourse.id},
                include: [
                  {
                    model: models.Tag,
                    include: [models.Class, models.Subject, models.Course]
                  },
                  {
                    model: models.MiniCourseCategory,
                    include: [models.Category]
                  }]
              }).then(function (miniCourseFinal) {
                res.send({success: "true", data: miniCourseFinal});
              }).catch(function (err) {
                console.log(err);
                res.send({success: "false", msg: "Could not find the MiniCourse right now"});
              });
            }).catch(function (err) {
              console.log(err);
              res.send({success: "false", msg: "Could not add the category tag right now"})
            })
          }).catch(function (err) {
            console.log(err);
            res.send({success: "false", msg: "Could not add the tags right now"});
          })
        }).catch(function (err) {
          console.log(err);
          res.send({success: "false", msg: "Could not find the course right now"});
        })
      }).catch(function (err) {
        console.log(err);
        res.send({success: "false", msg: "Could not find the subject right now"});
      })
    }).catch(function (err) {
      console.log(err);
      res.send({success: "false", msg: "Could not find the class right now"});
    })
  }).catch(function (err) {
    console.log(err);
    res.send({success: "false", msg: "Could not add the Course right now"});

  })

});

router.post('/:id/:miniCourseId/addLesson', passport.authenticate('bearer'), ensure.ensureAdmin(), function (req, res) {
  const tutorId = parseInt(req.params.id);
  const miniCourseId = parseInt(req.params.miniCourseId);
  console.log("***************************");
  console.log(miniCourseId);
  // models.Lesson.create({
  //     name:req.body.name,
  //     videoUrl:req.body.videoUrl,
  //     level:req.body.level,
  //     duration:req.body.duration,
  //     minicourseId:miniCourseId
  // }).then(function (lesson) {
  //     res.send(lesson);
  // }).catch(function (err) {
  //     console.log(err);
  //     res.send("Could not add the lesson right now");
  // });
  // console.log(req.body);
  let bulkInsertArray = [];
  for (let i = 0; i < req.body.lessons.length; i++) {
    let tempObject = {
      name: req.body.lessons[i].name,
      videoUrl: req.body.lessons[i].videoUrl,
      level: req.body.lessons[i].level,
      duration: req.body.lessons[i].duration,
      description: req.body.lessons[i].description,
      minicourseId: miniCourseId
    };
    bulkInsertArray.push(tempObject);
  }

  addLessons(bulkInsertArray).then(function (lessons) {
    res.send({success: "true", msg: lessons});
  }).catch(function (err) {
    console.log(err);
    res.send({success: 'false', msg: "Could not add the lesson right now"});
  })

});

async function addLessons(bulkInsertArray) {
  var finalLessons = [];
  for (let i = 0; i < bulkInsertArray.length; i++) {

    await models.Lesson.create(bulkInsertArray[i]).then(function (lesson) {
      console.log(i)
      finalLessons.push(lesson);
    })
  }
  return finalLessons;
}


//Write
router.post('/:id/:minicourseId/edit',  passport.authenticate('bearer'), ensure.ensureAdmin(),function (req, res) {

  const tutorId = parseInt(req.params.id);
  models.MiniCourse.update({
    name: req.body.name,
    noOfLessons: req.body.noOfLessons,
    description: req.body.description,
    level: req.body.level,
    duration: req.body.duration,
    medium: req.body.medium,
    tutorId: tutorId
  }, {
    where: {id: req.params.minicourseId}
  }).then(function (miniCourse) {
    models.Class.findOne({
      where: {
        id: req.body.classId
      }
    }).then(function (classObject) {
      models.Subject.findOne({
        where: {
          id: req.body.subjectId
        }
      }).then(function (subjectObject) {
        models.Course.findOne({
          where: {
            id: req.body.courseId
          }
        }).then(function (courseObject) {
          models.Tag.update({
            classId: classObject.id,
            subjectId: subjectObject.id,
            courseId: courseObject.id,
          }, {
            where: {minicourseId: req.params.minicourseId}
          }).then(function (tagRow) {
            models.MiniCourseCategory.destroy({
              where: {minicourseId: req.params.minicourseId}
            }).then(function () {
              let minicoursecategory = [];
              for (let i = 0; i < req.body.categoryIds.length; i++) {
                minicoursecategory.push({
                  categoryId: req.body.categoryIds[i],
                  minicourseId: req.params.minicourseId
                })
              }
              models.MiniCourseCategory.bulkCreate(minicoursecategory).then(function (minicourseCategories) {
                models.MiniCourse.findOne({
                  where: {id: req.params.minicourseId},
                  include: [
                    {
                      model: models.Tag,
                      include: [models.Class, models.Subject, models.Course]
                    },
                    {
                      model: models.MiniCourseCategory,
                      include: [models.Category]
                    }]
                }).then(function (miniCourseFinal) {
                  res.send({success: "true", data: miniCourseFinal});
                }).catch(function (err) {
                  console.log(err);
                  res.send({success: "false", msg: "Could not find the MiniCourse right now"});
                });
              }).catch(function (err) {
                console.log(err)
                res.send({success: "false", msg: "could not add categories right now"})
              })
            }).catch(function (err) {
              console.log(err);
              res.send({success: "false", msg: "Could not add the tags right now"});
            })
          }).catch(function (err) {
            console.log(err);
            res.send({success: "false", msg: "Could not add the course right now"});
          })
        }).catch(function (err) {
          console.log(err);
          res.send({success: "false", msg: "Could not add the course right now"});
        })
      }).catch(function (err) {
        console.log(err);
        res.send({success: "false", msg: "Could not add the subject right now"});
      })
    }).catch(function (err) {
      console.log(err);
      res.send({success: "false", msg: "Could not add the class right now"});
    })
  }).catch(function (err) {
    console.log(err);
    res.send({success: "false", msg: "Could not add the minicourse right now"});

  });
});

router.post('/:id/follow', passport.authenticate('bearer'), ensure.ensureStudent(),function (req, res) {

    let id = parseInt(req.params.id);
    models.Follow.create({
        tutorId: id,
        studentId: req.user.user.id,
    }).then(function (follow) {
        if (follow) {
            res.send({success: 'true'})
        } else {
            res.send({success: 'false', message: 'Could not follow this tutor'})
        }
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'false', message: 'Error'})
    });

});

router.get('/:id/isFollowed', passport.authenticate('bearer'), ensure.ensureStudent(), function (req, res) {
    let id = parseInt(req.params.id);
    models.Follow.findOne({
        where: {
          tutorId: id,
            studentId: req.user.user.id
        }
    }).then(function (follow) {
        if (follow) {
            res.send({success: 'true', message: 'followed'});
        } else {
            res.send({success: 'false' , message: 'not followed'});
        }
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'false', message: 'Error'})
    })
});


module.exports = router;