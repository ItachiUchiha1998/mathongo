const router = require('express').Router();
const models = require('./../db/models').models;
const uid = require('uid2');
const passutils = require('./../utils/password');
const nodemailer = require('nodemailer');
const password = require('../utils/password');
const secret = require('./../secrets.json');

var crypto = require('crypto');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mathongoanalyticstest@gmail.com',
    pass: 'mathongo@123'
  }
});


router.post('/', (req, res) => {
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
                res.send({success: true});
            } else {
                res.send({success: false});
            }
        }).catch(function(err) {
            console.log(err);
            res.send({success: 'error'});
        })
});

module.exports = router;
