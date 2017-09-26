const express = require('express')
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , passport = require('./passport/passporthandler')
  , path = require('path')
  , cookieParser = require('cookie-parser');

const app = express();

const secrets = require('./secrets.json')
  , loginrouter = require('./routers/login')
  , logoutrouter = require('./routers/logout')
  , signuprouter = require('./routers/signup')
  , authorizerouter = require('./routers/authorize')
  , apirouter = require('./routers/api')
  , models = require('./db/models').models;

const ensure = require('./passport/passportutils');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', express.static(path.join(__dirname, 'public_html')));
app.use(cookieParser(secrets.EXPRESS_SESSIONS_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//
// app.use(session({
//     secret: secrets.EXPRESS_SESSIONS_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));
//
app.use(passport.initialize());
// app.use(passport.session());
app.use('/signup', signuprouter);
app.use('/login', loginrouter);
app.use('/logout', logoutrouter);
app.use('/authorize', authorizerouter);
app.get('/checkAdmin', passport.authenticate('bearer'), ensure.ensureAdmin(), function (req, res) {
  return res.send({success: "true"});
});

app.get('/checkLoggedIn', passport.authenticate('bearer'), ensure.ensureLogin(), function (req, res) {
  return res.send({success: "true"});
});

//TODO passport.authenticate(['session', 'bearer-student'])

app.use('/api', apirouter);

app.get('/courses/:id', function (req, res) {
  let miniCourseId = +req.params.id;
  models.MiniCourse.findByPrimary(miniCourseId).then(function (minicourse) {
    if(minicourse){
      res.redirect('/courses/'+minicourse.id+'/'+minicourse.name);
    }else{
      res.send("No Minicourse Found")
    }
  }).catch(function (err) {
    console.log(err);
    res.send("ERROR");
  })
});

app.use('/courses/:id/:name', express.static(path.join(__dirname, 'public_html/minicourse')));
app.use('/library', express.static(path.join(__dirname, 'public_html/allMiniCourses')));
app.use('/lessons/:id/:name', express.static(path.join(__dirname, 'public_html/lesson')));
app.use('/student/mycourses', express.static(path.join(__dirname, 'public_html/students/mycourses')));
app.use('/student/mybookmarks', express.static(path.join(__dirname, 'public_html/students/mybookmarks')));
app.use('/admin/dashboard', express.static(path.join(__dirname, 'public_html/admin/dashboard')));


app.listen(8080, function () {
  console.log("Listening on 8080");
});