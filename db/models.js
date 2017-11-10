const Sequelize = require('sequelize');

const db = new Sequelize('mathongo', 'muser', 'mathongopass', {
  host: 'mathongo.cdkn595tutfq.ap-south-1.rds.amazonaws.com',
  port: 5432,
  dialect: 'postgres'
});

/*const db = new Sequelize('mathongo', 'muser', 'mathongopass', {
  host: 'mathongo.cdkn595tutfq.ap-south-1.rds.amazonaws.com',
  port: 5432,
  dialect: 'postgres'
});*/

// const db = new Sequelize('mathongo', 'muser', 'mpass', {
//   host: 'localhost',
//   dialect: 'postgres'
// });

const Student = db.define('student', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING,
  email: {type: Sequelize.STRING, unique: true},
  class: Sequelize.STRING,
  contact: Sequelize.STRING,
  pincode: Sequelize.STRING
});

const Tutor = db.define('tutor', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  img: Sequelize.STRING(1234),
  name: Sequelize.STRING,
  email: {type: Sequelize.STRING, unique: true},
  description: Sequelize.STRING(1234),
  contact: Sequelize.STRING
});

const Admin = db.define('admin', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: Sequelize.STRING, unique: true},
  name: Sequelize.STRING,
});

const UserLocal = db.define('userlocal', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: Sequelize.STRING},
  password: Sequelize.STRING,
  role: Sequelize.STRING
});

const AuthToken = db.define('authtoken', {
  token: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  role: Sequelize.STRING
});

AuthToken.belongsTo(UserLocal);
UserLocal.hasMany(AuthToken);
UserLocal.belongsTo(Student);
Student.hasOne(UserLocal);
UserLocal.belongsTo(Tutor);
Tutor.hasOne(UserLocal);
UserLocal.belongsTo(Admin);
Admin.hasOne(UserLocal);


const MiniCourse = db.define('minicourse', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING,
  noOfLessons: Sequelize.STRING,
  description: Sequelize.STRING,
  level: Sequelize.STRING,
  medium: Sequelize.STRING,
  duration: Sequelize.STRING,
  img: {type: Sequelize.STRING, defaultValue: ""},
  noOfReviews: {type: Sequelize.INTEGER, defaultValue: 0},
  noOfRatings: {type: Sequelize.INTEGER, defaultValue: 0},
  rating: {type: Sequelize.REAL, defaultValue: 0}
});

const Lesson = db.define('lesson', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  name: Sequelize.STRING,
  videoUrl: Sequelize.STRING(1234),
  level: Sequelize.STRING,
  duration: Sequelize.STRING,
  description: Sequelize.STRING,
  noOfComments : {type: Sequelize.INTEGER, defaultValue: 0}
});

const Bookmark = db.define('bookmark', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
});

const Enrollment = db.define('enrollment', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
});

const Report = db.define('report', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  description: Sequelize.STRING(1234),
});

const Follow = db.define('follow', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
});

const Upvote = db.define('upvote', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
});

const Review = db.define('review', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  rating: Sequelize.DataTypes.REAL,      //discuss
  description: Sequelize.STRING(5000),
});

const Comment = db.define('comment', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  description: Sequelize.STRING(5000)
});


/*const Materials = db.define('materials', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  description: Sequelize.STRING(5000),
  destination: Sequelize.STRING(1234) 
});*/

const Class = db.define('class', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  className: Sequelize.STRING
});

const Subject = db.define('subject', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  subjectName: Sequelize.STRING
});

const Course = db.define('course', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  courseName: Sequelize.STRING
});

const Category = db.define('category', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  categoryName: Sequelize.STRING
});

const MiniCourseCategory = db.define('minicoursecategory', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
});

const Tag = db.define('tag', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
});

MiniCourse.belongsTo(Tutor);
Tutor.hasMany(MiniCourse);

Lesson.belongsTo(MiniCourse);
MiniCourse.hasMany(Lesson);

Bookmark.belongsTo(Student);
Bookmark.belongsTo(Lesson);
Student.hasMany(Bookmark);
Lesson.hasMany(Bookmark);

Enrollment.belongsTo(Student);
Enrollment.belongsTo(MiniCourse);
Student.hasMany(Enrollment);
MiniCourse.hasMany(Enrollment);

Report.belongsTo(Student);
Report.belongsTo(Lesson);
Student.hasMany(Report);
Lesson.hasMany(Report);

Follow.belongsTo(Student);
Follow.belongsTo(Tutor);
Student.hasMany(Follow);
Tutor.hasMany(Follow);

Upvote.belongsTo(Student);
Upvote.belongsTo(Lesson);
Student.hasMany(Upvote);
Lesson.hasMany(Upvote);

Review.belongsTo(Student);
Review.belongsTo(MiniCourse);
Student.hasMany(Review);
MiniCourse.hasMany(Review);

Comment.belongsTo(Student);
Comment.belongsTo(Lesson);
Student.hasMany(Comment);
Lesson.hasMany(Comment);

/*Materials.belongsTo(Student);
Materials.belongsTo(MiniCourse);
Student.hasMany(Materials);
MiniCourse.hasMany(Materials);
*/
Tag.belongsTo(Class);
Tag.belongsTo(Subject);
Tag.belongsTo(Course);
Tag.belongsTo(MiniCourse);
Class.hasMany(Tag);
Subject.hasMany(Tag);
Course.hasMany(Tag);
MiniCourse.hasOne(Tag);

MiniCourseCategory.belongsTo(MiniCourse);
MiniCourseCategory.belongsTo(Category);
Category.hasMany(MiniCourseCategory);
MiniCourse.hasMany(MiniCourseCategory);


db.sync({alter: false}).then(() => {
  console.log('Database configured')
});

module.exports = {
  models: {
    Student,
    Tutor,
    Admin,
    UserLocal,
    AuthToken,
    MiniCourse,
    Lesson,
    Bookmark,
    Enrollment,
    Report,
    Follow,
    Upvote,
    Review,
    Comment,
    //Materials,
    Class,
    Subject,
    Course,
    Tag,
    Category,
    MiniCourseCategory
  }
};

