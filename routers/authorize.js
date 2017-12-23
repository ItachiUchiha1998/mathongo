const router = require('express').Router();
const models = require('./../db/models').models;
const uid = require('uid2');
const passutils = require('./../utils/password');
const nodemailer = require('nodemailer');
const password = require('../utils/password');
const secret = require('./../secrets.json');
const sequelize = require('sequelize');
const passport = require('../passport/passporthandler');
const ensure = require('../passport/passportutils');

var crypto = require('crypto');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mathongoanalyticstest@gmail.com',
    pass: 'mathongo@123'
  }
});

router.post('/', (req, res) => {
    if (req.body.email != "" ) {
        models.UserLocal.findOne({
        where: {
            email: req.body.email,
        }, include: [models.Student, models.Tutor, models.Admin]
    }).then(function (user) {
        if (!user) {
            return res.send({
                success: "false",
                message: "Incorrect Email"
            })
        }
        // console.log(user.get());
        passutils.compare2hash(req.body.password, user.password).then(function (match) {
            if (match) {
                models.AuthToken.create({
                    token: uid(30),
                    role: user.role,
                    userlocalId: user.id
                }).then(function (authToken) {
                    console.log("***************")
                    console.log(authToken)
                    console.log("***************")
                    console.log(user.student)
                    res.send({student: user.student})
                    if (user.student) {
                        return res.send({
                            success: 'true',
                            url: '/library',
                            name: user.student.name,
                            token: authToken.token
                        })
                    }
                    else if (user.tutor) {
                        return res.send({
                            success: 'true',
                            name: user.tutor.name,
                            url: '/library',
                            token: authToken.token
                        })
                    }
                    else if (user.admin) {
                        return res.send({
                            success: 'true',
                            url: '/admin/dashboard',
                            name: user.admin.name,
                            token: authToken.token
                        })
                    }
                    else {
                        return res.send({
                            success: 'false',
                            message: 'Incorrect User'
                        })
                    }
                }).catch(function (err) {
                    console.log(err);
                    res.send({success: 'false'})
                })
            } else {
                res.send({success: 'false',
                message: 'Incorrect Password'});
            }
        }).catch(function (err) {
            console.log("************")
            console.log("pass error")
            console.log(err);
            res.send({success: 'false'});
        });
    }).catch(function (err) {
        console.log("***********");
        console.log("user error")
        console.log(err);
        res.send({success: 'false'});
    });
    } else {
            models.UserLocal.findOne({
            where: {
                contact: req.body.contact,
            }, include: [models.Student, models.Tutor, models.Admin]
        }).then(function (user) {
            if (!user) {
                console.log("Old user")
                models.Student.findOne({
                    where: { contact: req.body.contact }
                }).then(function(stud){
                    if (stud) {
                        models.UserLocal.findOne({
                            where: { email: stud.email },
                            include: [models.Student, models.Tutor, models.Admin]
                        }).then(function(user){
                passutils.compare2hash(req.body.password, user.password).then(function (match) {
            if (match) {
                models.AuthToken.create({
                    token: uid(30),
                    role: user.role,
                    userlocalId: user.id
                }).then(function (authToken) {
                    console.log("***************")
                    console.log(authToken)
                    console.log("***************")
                    console.log(user.student)
                    res.send({student: user.student})
                    if (user.student) {
                        return res.send({
                            success: 'true',
                            url: '/library',
                            name: user.student.name,
                            token: authToken.token
                        })
                    }
                    else {
                        return res.send({
                            success: 'false',
                            message: 'Incorrect User'
                        })
                    }
                }).catch(function (err) {
                    console.log(err);
                    res.send({success: 'false'})
                })
            } else {
                res.send({success: 'false',
                message: 'Incorrect Password'});
            }
        }).catch(function (err) {
            console.log("************")
            console.log("pass error")
            console.log(err);
            res.send({success: 'false'});
        });

                        }).catch(function(err){
                            console.log(err);
                            res.send({message: 'error'})
                        })
                    } else {
                        return res.send({message:'Incorrect contact'});
                    }
                }).catch(function(err){
                    console.log(err);
                    return res.send('error');
                })
            } else {
            console.log(user.get());
            passutils.compare2hash(req.body.password, user.password).then(function (match) {
                if (match) {
                    models.AuthToken.create({
                        token: uid(30),
                        role: user.role,
                        userlocalId: user.id
                    }).then(function (authToken) {
                        console.log("***************")
                        console.log(authToken)
                        res.send({student: user.student})
                        if (user.student) {
                            return res.send({
                                success: 'true',
                                url: '/library',
                                name: user.name,//user.student.name,
                                token: authToken.token
                            })
                        }
                        else if (user.tutor) {
                            return res.send({
                                success: 'true',
                                name: user.tutor.name,
                                url: '/library',
                                token: authToken.token
                            })
                        }
                        else if (user.admin) {
                            return res.send({
                                success: 'true',
                                url: '/admin/dashboard',
                                name: user.admin.name,
                                token: authToken.token
                            })
                        }
                        else {
                            return res.send({
                                success: 'false',
                                message: 'Incorrect User'
                            })
                        }
                    }).catch(function (err) {
                        console.log(err);
                        res.send({success: 'err'})
                    })
                } else {
                    res.send({success: 'false',
                    message: 'Incorrect Password'});
                }
            }).catch(function (err) {
                console.log("************")
                console.log("pass error")
                console.log(err);
                res.send({success: 'false'});
            });
        }}).catch(function (err) {
            console.log("***********");
            console.log("user error")
            console.log(err);
            res.send({success: 'falsee'});
        });

    }
});

router.post('/forgot', function(req,res) {
  var email = req.body.email;
  console.log(email);

  models.UserLocal.findOne({
        where: {
            email: req.body.email,
        }, include: [models.Student, models.Tutor, models.Admin]
    }).then(function (user) {
        if (!user) {
            console.log("No such User")
        } else {
            console.log("Sending Password Reset mail...")
            
            var token =  crypto.randomBytes(100).toString('hex');

            models.ResetPasswordToken.create({
                email: email,
                token: token,
                expirationTime: Date.now() + 3600000,
            });

            var mailOptions = {
              from: 'mathongoanalyticstest@gmail.com',
              to: email,
              subject: 'noreply',
              text: 'Reset your password for Mathongo by clicking on this link => http://localhost:8080/authorize/reset/'+token
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.send({success: false})
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send({success: true})
              }
            });

        }

    });

});

router.get('/reset/:token', (req,res) => {

    models.ResetPasswordToken.findOne({
        where: { token: req.params.token  }
    }).then(function(token) {
        console.log("Reset Pass")
        if (!token || Date.now() > token.expirationTime) {
            console.log("Token not valid or Time Limit Exceeded")
        } else {
            console.log("Token for : " + token.email + " " + token.expirationTime)
        }
    })
});

router.post('/reset/:token', (req,res) => {

    var token = req.params.token;

    models.ResetPasswordToken.findOne({
        where: { token: token  }
    }).then(function(token) {
        
        console.log("Reset Pass to: " + req.body.password);
        if (!token || Date.now() > token.expirationTime) {
            res.send({success: false})
            console.log("Token not valid or Time Limit Exceeded")
        } else {
                 password.pass2hash(req.body.password).then(function (hash) {
                    models.UserLocal.find({ where: { email: token.email } })
                    .then(function (record) {
                        if (record) {
                         record.update({
                            password: hash
                    })
                    .then(function () {
                        res.send({success: true})
                        console.log("Password Updated");
                       })
                    }
                })
             }).catch(function (err) {
                console.log(err);
                res.send({success: 'error'});
            })
        }
    }) ;
});

router.post('/check/:refercode', (req,res) => {
    models.ReferCode.find({ where: { refercode: req.params.refercode } })
        .then(function(code) {
            if(code) {
                res.send({success: 'Exists'});
            } else {
                res.send({success: 'Not Exists'});
            }
        }).catch(function(err) {
            console.log(err);
            res.send({success: 'error'});
        })
});

router.post('/addcode/:id' , (req,res) => {
    var refercode = req.body.refercode;
    models.ReferCode.find({ where: { refercode: refercode } })
        .then(function(add) {
            if (add) { 
                add.update(
                 {'hasRefered': sequelize.fn('array_append', sequelize.col('hasRefered'), req.params.id)},
                ).then(function() {
                    add.update(
                        { 'size': sequelize.fn('array_length', sequelize.col('hasRefered'),1) }
                    ).then(function(){
                    models.ReferCode.find({where: {refercode: refercode}})
                        .then(function(check){
                            if (check.size >= 2) {
                                models.UnlockCourses.findOne({
                                    where: { studentId: check.studentId }
                                }).then(function(unlock){
                                    models.UnlockCourses.create(
                                        {   
                                            studentId: check.studentId ,
                                            isUnlocked: true
                                        }
                                    ).then(function(){
                                        res.send({message: 'Unlocked'})
                                    })
                                })
                            } else {
                                res.send({message: 'Not Unlocked'})
                            }
                        })
                    })
                }).catch(function(err) {
                    console.log(err);
                });
            } else {
                res.send({success: 'fallse'});
            }
        }).catch(function(err) {
            console.log(err);
            res.send({success: 'error'});
        })
});

router.post('/addrefercode', (req,res) => {
    models.ReferCode.create({
        studentId: req.body.studentId,
        refercode: req.body.refercode
    }).then(function(data) {
        if (data) {
      res.send({ success: true })
    }
    else {
      res.send({success: false});
    }
    }).catch(function(err) {
        res.send({success: false});
        console.log(err);
    })
});

router.get('/isunlocked', passport.authenticate('bearer') , (req,res) => {
    models.UnlockCourses.find({ where: { studentId: req.user.user.id } })
        .then(function(student) {
            if (student) {
                res.send({ allowed: student.isUnlocked })
            } else {
                res.send({success: 'Not Present'})
            }
        })
});

/*router.post('/isunlocked', passport.authenticate('bearer') , (req,res) => {
    models.UnlockCourses.find({ where: { studentId: req.user.user.id } })
        .then(function(student) {
            if (student) {
                if (student.isUnlocked == false) {
                    student.update({
                        isUnlocked: true
                    })
                } else {
                    res.send({success: 'Already True' });
                }
            } else {
                res.send({success: 'Not Present'})
            }
        })
});*/

router.post('/referexists/:id', (req,res) => {
    models.ReferCode.find({ where: { studentId: req.params.id } })
        .then(function(code) {
            if (code) {
                if (code.refercode != null) {
                    res.send({ success: true })
                } else {
                    res.send({ success: false })
                }
            } else {
                res.send({success: 'Id not found'})
            }
        }).catch(function(err) {
           console.log(err);
           res.send({success: 'error'}); 
        })
});

/*router.post('/refered/:id', (req,res) => {
  models.ReferCode.findOne({
    where: { id: req.params.id }
  }).then(function(refer) {
    res.send({ refer: refer.hasRefered });
  }).catch(function(err) {
    res.send({success: false });
    console.log(err);
  })
});*/

module.exports = router;
