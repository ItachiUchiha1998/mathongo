const router = require('express').Router();
const models = require('../db/models').models;
const sequelize = require('sequelize');
const password = require('../utils/password');
const secret = require('./../secrets.json');

router.post('/student', function (req, res,next) {

    if (req.body.name === "" || req.body.email === "" || req.body.password === "" || req.body.contact === "") {
        res.send("Insufficient Details");
    }

    models.Student.findOne({ where: {email: req.body.email} }).then(function(email){
            if (email) {
                console.log("exists");
                res.send({success : 'exists'});
            }
            else {
                models.Student.findOne({ where: {contact: req.body.contact} }).then(function(contact){
                    if (contact) {
                        console.log("duplicate");
                        res.send({success : 'duplicate'});
                    }
                    else {
                        password.pass2hash(req.body.password).then(function (hash) {
                        models.UserLocal.create({
                        email: req.body.email,
                        password: hash,
                        role: "Student",
                        contact: req.body.contact,
                        student: {
                            name: req.body.name,
                            email: req.body.email,
                            contact: req.body.contact,
                            class: req.body.class,
                            pincode: req.body.pincode
                        }
            }, {
                include: [models.Student]
            }).then(function (userLocal) {
                console.log(userLocal.get());
                console.log("=-----------------=");
                console.log(userLocal.student.get());
                if (userLocal) {
                    res.send({success: 'true'});
                } else {
                    res.send({success: 'false'})
                }
            }).catch(function (err) {
                console.log(err);
                res.send({success: 'error'});
            })
        }).catch(function (err) {
            console.log(err);
            res.send({success: 'error'});
        })
                    }
                })
            }
    });
});

router.post('/tutor', function (req, res) {

    if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
        res.send({isSuccess: "false", msg: "Insufficient Details"});
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
            res.send({success: 'error'});
        })
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'error'});
    })
});


router.post('/admin', function (req, res) {

    if (req.body.name === "" || req.body.email === "" || req.body.password === "") {
        return res.send("Insufficient Details");
    }
    if (req.body.secret === secret.ADMIN_SECRET) {
        password.pass2hash(req.body.password).then(function (hash) {
            models.UserLocal.create({
                email: req.body.email,
                password: hash,
                role: "Admin",
                admin: {
                    name: req.body.name,
                    email: req.body.email,
                }
            }, {
                include: [models.Admin]
            }).then(function (userLocal) {
                if (userLocal) {
                    return res.send({success: 'true'});
                } else {
                    return res.send({success: 'false'})
                }
            }).catch(function (err) {
                console.log(err);
                return res.send({success: 'error'});
            })
        }).catch(function (err) {
            console.log(err);
            return res.send({success: 'error'});
        })
    }
    else {
        return res.send("only admin");
    }
});

router.post('/contact', (req,res) => {
    
    if( req.body.contact === "" ) {
        res.send("Empty Field")
    }

    models.Student.findOne({ where: {contact: req.body.contact} }).then(function(contact){
                    if (contact) {
                        console.log("not Unique");
                        res.send({success : 'Not unique'});
                    }
                    else {
                        console.log("Unique")
                        res.send({success : 'Unique'});
                    }
                })

});

router.post('/newstudent' , (req,res) => {
   if (req.body.name === "" || req.body.email === "" || req.body.password === "" || req.body.contact === "") {
        res.send("Insufficient Details");
    }
    models.Student.findOne({ where: {contact: req.body.contact} }).then(function(contact){
                if (contact) {
                    console.log("duplicate");
                    res.send({success : 'duplicate'});
                }
                else {
                    password.pass2hash(req.body.password).then(function (hash) {
                    models.UserLocal.create({
                    email: req.body.email,
                    password: hash,
                    role: "Student",
                    student: {
                        name: req.body.name,
                        email: req.body.email,
                        contact: req.body.contact,
                    }
        }, {
            include: [models.Student]
        }).then(function (userLocal) {
            console.log(userLocal.get());
            console.log("=-----------------=");
            models.UnlockCourses.create({
                studentId: userLocal.student.id
            })
            console.log(userLocal.student.get());
            if (userLocal) {
                //res.send({success: 'true'});
                res.send({student: userLocal.student.get()});
            } else {
                res.send({success: 'false'})
            }
        }).catch(function (err) {
            console.log(err);
            res.send({success: 'error'});
        })
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'error'});
    })
}
 })
});

router.put('/newstudent/:contact', (req,res) => {
    if (req.body.class === "" || req.body.prefered_exam === "" || req.body.location === "" || req.body.mode_of_study === "" ) {
        res.send({success:"Insufficient Details"});
    }
    models.Student.find({ where: { contact: req.params.contact } })
    .then(function (record) {
        if (record) {
             record.update({
                class: req.body.class,
                location: req.body.location,
                prefered_exam: sequelize.fn('array_append', sequelize.col('prefered_exam'), req.body.prefered_exam),
                mode_of_study: req.body.mode_of_study,
                pincode: req.body.pincode
        })
        .then(function (record) {
            //res.send({student: record.get()});
            res.send({success: true})
            console.log("Updated");
           })
        }
    }).catch(function (err) {
        console.log(err);
        res.send({success: 'error'});
    })
});

module.exports = router;