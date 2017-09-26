$(document).ready(function () {
    $.ajax({
      url: '/checkAdmin',
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    }).done(function (data) {
        console.log(1);
        console.log(data);
        if (data.success === 'true') {
          $msg = $('#msg');
          $form = $('#dataForm');
          $form.submit(function (e) {
            e.preventDefault();
          });

          $('#tutorButton').click(function () {
            $form.text('');
            $msg.text('');
            $form.append(`
            <label>
                    Name: <input type="text" style="width: 250px" id="tutor-name"  required>
            </label>
            <br><br>
            <label>
                    Email: <input type="email" style="width: 250px" id="tutor-email"  required>
            </label>
            <br><br>
            <label>
                    Password: <input type="password" style="width: 250px" id="tutor-password"  required>
            </label>
            <br><br>
            <label>
                    Contact: <input type="text" style="width: 250px" id="tutor-contact"  required>
            </label>
            <br><br>
            <label>
                    Image: (name in all lowercase) <input type="text"  style="width: 250px" id="tutor-img"  required>
            </label>
            <br><br>
            <label>
                    Description:(25 words)<br><textarea type="text"  cols="60"  rows="5" id="tutor-description"  required></textarea>
            </label>
            <br><br>
            <button class="btn buttons" id="submit">Submit</button>
        `);

            $submit = $('#submit');
            $submit.unbind('click');
            $submit.click(function () {
              var name = $('#tutor-name').val(),
                password = $('#tutor-password').val(),
                email = $('#tutor-email').val(),
                img = $('#tutor-img').val(),
                contact = $('#tutor-contact').val(),
                description = $('#tutor-description').val();

              if (name !== "" && password !== "" && email !== "" && img !== "" && contact !== "" && description !== "") {

                $.ajax({
                  url: "/api/tutors/add",
                  data: {
                    name: name,
                    password: password,
                    email: email,
                    img: img,
                    contact: contact,
                    description: description
                  },
                  method: 'POST',
                  headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  }
                }).done(function (data) {
                  console.log(data);
                  if (data.success === 'true') {
                    $form.text('');
                    $msg.attr('class', 'text-success').text('Tutor Added');
                  } else {
                    $msg.attr('class', 'text-danger').text('Error, Try Again');
                  }
                }).fail(function (object) {
                  if (object.responseText === 'Unauthorized') {
                    window.alert("Please Login First");
                    window.location.replace('/admin');
                  }
                })
              }
              else {
              }

            })
          });

          $('#viewTutorsButton').click(function () {
            $form.text("");
            $msg.text("");
            $.get("/api/tutors", function (tutors) {
              tutors = tutors.data;
              $form.append(`<ul id="tutors-list" class="list-group" ></ul>`);
              const $tutors_list = $('#tutors-list');
              tutors.forEach(function (tutor) {
                $tutors_list.append(`
                          <li class="list-group-item" tutorId="` + tutor.id + `">
                          <span>` + tutor.name + `</span>
                          <button class="btn btn-outline-info edit" style="margin-left: 20px">Edit</button>
                          <button class="btn btn-outline-danger delete" style="margin-left: 20px">Delete</button>
                          </li>
                        `)
              });
              $('.edit').click(function (e) {
                let tutorId = e.target.parentElement.getAttribute('tutorId');
                console.log(tutorId);
                $form.text("");
                $msg.text("");
                $.get("/api/tutors/" + tutorId, function (tutor) {
                  $form.append(`
                    <label>
                    Name: <input type="text" style="width: 250px" id="tutor-name"  required>
            </label>
            <br><br>
            <label>
                    Email: <input type="email" style="width: 250px" id="tutor-email"  required>
            </label>
            <br><br>
            <label>
                    Contact: <input type="text" style="width: 250px" id="tutor-contact"  required>
            </label>
            <br><br>
            <label>
                    Image: (name in all lowercase) <input type="text"  style="width: 250px" id="tutor-img"  required>
            </label>
            <br><br>
            <label>
                    Description:(25 words)<br><textarea type="text"  cols="60"  rows="5" id="tutor-description"  required></textarea>
            </label>
            <br><br>
                   `);
                  $('#tutor-name').val(tutor.name);
                  $('#tutor-email').val(tutor.email);
                  $('#tutor-contact').val(tutor.contact);
                  $('#tutor-img').val(tutor.img);
                  $('#tutor-description').val(tutor.description);


                  $form.append(`<button class="btn buttons" id="save">Save</button>`);
                  $save = $('#save');
                  $save.unbind('click');
                  // let counter = 0;
                  $save.click(function () {
                    tutorData = {
                      name: $('#tutor-name').val(),
                      email: $('#tutor-email').val(),
                      contact: $('#tutor-contact').val(),
                      img: $('#tutor-img').val(),
                      description: $('#tutor-description').val()
                    };

                    $.ajax({
                      url: "/api/tutors/" + tutorId,
                      data: tutorData,
                      method: 'PUT',
                      headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                      }
                    }).done(function (tutorFinal) {
                      if (tutorFinal.success) {
                        $form.text('');
                        $msg.attr('class', 'text-success').text('Tutor changes saved');
                      } else {
                        $msg.attr('class', 'text-danger').text(tutorFinal.data);
                      }
                    }).fail(function (object) {
                      if (object.responseText === 'Unauthorized') {
                        window.alert("Please Login First");
                        window.location.replace('/admin');
                      }
                    })
                  })

                });
              });
              $('.delete').click(function (e) {
                let tutorId = e.target.parentElement.getAttribute('tutorId');
                $.ajax({
                  url: "/api/tutors/" + tutorId,
                  method: 'DELETE',
                  headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  }
                }).done(function (tutor) {
                  if (tutor.success) {
                    $form.text('');
                    $msg.attr('class', 'text-success').text(tutor.data);
                  } else {
                    $msg.attr('class', 'text-danger').text(tutor.data);
                  }
                })
              });

            });
          });

          $('#classButton').click(function () {
            $form.text("");
            $msg.text("");
            $form.append(`
            <label>
            Class name : <input type="text" id="className" required>
            </label>
            <button class="btn buttons" id="submit">Submit</button>
        `);

            $.get('/api/extra/allClasses', function (classes) {
              if (classes.success === 'true') {
                $msg.append(`<ul id="classes-list" class="list-group" ></ul>`);
                const $classes_list = $('#classes-list');
                let allClasses = classes.data
                allClasses.forEach(function (classObj) {
                  $classes_list.append(`
                          <li class="list-group-item" classId="` + classObj.id + `">
                          <span>` + classObj.className + `</span>
                          <button class="btn btn-outline-danger delete" style="margin-left: 20px">Delete</button>
                          </li>
                        `)
                });
                $('.delete').click(function (e) {
                  let classId = e.target.parentElement.getAttribute('classId');
                  $.ajax({
                    url: "/api/extra/deleteClass/" + classId,
                    method: 'DELETE',
                    headers: {
                      "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                  }).done(function (deletedClass) {
                    if (deletedClass.success) {
                      $form.text('');
                      $msg.attr('class', 'text-success').text(deletedClass.data);
                    } else {
                      $msg.attr('class', 'text-danger').text(deletedClass.data);
                    }
                  })
                });
              }
            })

            $submit = $('#submit');
            $submit.unbind('click');
            $submit.click(function () {


              var className = $('#className').val();
              if (className !== "") {
                $.ajax({
                  url: "/api/extra/addClass",
                  data: {className: className},
                  method: 'POST',
                  headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  }
                }).done(function (data) {
                  if (data.isSuccess === 'true') {
                    $form.text('');
                    $msg.attr('class', 'text-success').text('Class Added');
                  } else {
                    $msg.attr('class', 'text-danger').text('Error, Try Again');
                  }
                }).fail(function (object) {
                  if (object.responseText === 'Unauthorized') {
                    window.alert("Please Login First");
                    window.location.replace('/admin');
                  }
                })
              }
              else {

              }
            })
          });

          $('#subjectButton').click(function () {
            $form.text("");
            $msg.text("");
            $form.append(`
            <label>
            Subject name : <input type="text" id="subjectName" required>
            </label>
            <button class="btn buttons" id="submit">Submit</button>
        `);

            $.get('/api/extra/allSubjects', function (subjects) {
              if (subjects.success === 'true') {
                $msg.append(`<ul id="subjects-list" class="list-group" ></ul>`);
                const $subjects_list = $('#subjects-list');
                let allsubjects = subjects.data
                allsubjects.forEach(function (subjectObj) {
                  $subjects_list.append(`
                          <li class="list-group-item" subjectId="`+subjectObj.id+`">
                          <span>` + subjectObj.subjectName + `</span>
                          <button class="btn btn-outline-danger delete" style="margin-left: 20px">Delete</button>
                          </li>
                        `)
                });
                $('.delete').click(function (e) {
                  let subjectId = e.target.parentElement.getAttribute('subjectId');
                  $.ajax({
                    url: "/api/extra/deleteSubject/" + subjectId,
                    method: 'DELETE',
                    headers: {
                      "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                  }).done(function (deletedSubject) {
                    if (deletedSubject.success) {
                      $form.text('');
                      $msg.attr('class', 'text-success').text(deletedSubject.data);
                    } else {
                      $msg.attr('class', 'text-danger').text(deletedSubject.data);
                    }
                  })
                });

              }
            })

            $submit = $('#submit');
            $submit.unbind('click');
            $submit.click(function () {

              var subjectName = $('#subjectName').val();
              if (subjectName !== "") {
                $.ajax({
                  url: "/api/extra/addSubject",
                  data: {subjectName: subjectName},
                  method: 'POST',
                  headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  }
                }).done(function (data) {
                  console.log(1);
                  if (data.isSuccess === 'true') {
                    $form.text('');
                    $msg.attr('class', 'text-success').text('Subject Added');
                  } else {
                    $msg.attr('class', 'text-danger').text('Error, Try Again');
                  }
                }).fail(function (object) {
                  if (object.responseText === 'Unauthorized') {
                    window.alert("Please Login First");
                    window.location.replace('/admin');
                  }
                })
              }
              else {

              }
            })
          });

          $('#chapterButton').click(function () {
            $form.text("");
            $msg.text("");
            $form.append(`
            <label>
            Chapter name : <input type="text" id="courseName"  required>
            </label>
            <button class="btn buttons" id="submit">Submit</button>
        `);

            $.get('/api/extra/allCourses', function (courses) {
              if (courses.success === 'true') {
                $msg.append(`<ul id="courses-list" class="list-group" ></ul>`);
                const $courses_list = $('#courses-list');
                let allcourses = courses.data
                allcourses.forEach(function (courseObj) {
                  $courses_list.append(`
                          <li class="list-group-item" courseId="`+courseObj.id+`">
                          <span>` + courseObj.courseName + `</span>
                          <button class="btn btn-outline-danger delete" style="margin-left: 20px">Delete</button>
                          </li>
                        `)
                });
                $('.delete').click(function (e) {
                  let courseId = e.target.parentElement.getAttribute('courseId');
                  $.ajax({
                    url: "/api/extra/deleteCourse/" + courseId,
                    method: 'DELETE',
                    headers: {
                      "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                  }).done(function (deletedCourse) {
                    if (deletedCourse.success) {
                      $form.text('');
                      $msg.attr('class', 'text-success').text(deletedCourse.data);
                    } else {
                      $msg.attr('class', 'text-danger').text(deletedCourse.data);
                    }
                  })
                });

              }
            })

            $submit = $('#submit');
            $submit.unbind('click');
            $submit.click(function () {


              var courseName = $('#courseName').val();
              if (courseName !== "") {
                $.ajax({
                  url: "/api/extra/addCourse",
                  data: {courseName: courseName},
                  method: 'POST',
                  headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  }
                }).done(function (data) {
                  if (data.isSuccess === 'true') {
                    $form.text('');
                    $msg.attr('class', 'text-success').text('Chapter Added');
                  } else {
                    $msg.attr('class', 'text-danger').text('Error, Try Again');
                  }
                }).fail(function (object) {
                  if (object.responseText === 'Unauthorized') {
                    window.alert("Please Login First");
                    window.location.replace('/admin');
                  }
                })
              }
              else {

              }
            })
          });

          $('#categoryButton').click(function () {
            $form.text("");
            $msg.text("");
            $form.append(`
            <label>
            Category name : <input type="text" id="categoryName"  required>
            </label>
            <button class="btn buttons" id="submit">Submit</button>
        `);

            $.get('/api/extra/allCategories', function (categories) {
              if (categories.success === 'true') {
                $msg.append(`<ul id="categories-list" class="list-group" ></ul>`);
                const $categories_list = $('#categories-list');
                let allcategories = categories.data
                allcategories.forEach(function (categoryObj) {
                  $categories_list.append(`
                          <li class="list-group-item" categoryId="`+categoryObj.id+`">
                          <span>` + categoryObj.categoryName + `</span>
                          <button class="btn btn-outline-danger delete" style="margin-left: 20px">Delete</button>
                          </li>
                        `)
                });
                $('.delete').click(function (e) {
                  let categoryId = e.target.parentElement.getAttribute('categoryId');
                  $.ajax({
                    url: "/api/extra/deleteCategory/" + categoryId,
                    method: 'DELETE',
                    headers: {
                      "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                  }).done(function (deletedCategory) {
                    if (deletedCategory.success) {
                      $form.text('');
                      $msg.attr('class', 'text-success').text(deletedCategory.data);
                    } else {
                      $msg.attr('class', 'text-danger').text(deletedCategory.data);
                    }
                  })
                });

              }
            })

            $submit = $('#submit');
            $submit.unbind('click');
            $submit.click(function () {

              var categoryName = $('#categoryName').val();
              if (categoryName !== "") {
                $.ajax({
                  url: "/api/extra/addCategory",
                  data: {categoryName: categoryName},
                  method: 'POST',
                  headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  }
                }).done(function (data) {
                  if (data.isSuccess === 'true') {
                    $form.text('');
                    $msg.attr('class', 'text-success').text('Category Added');
                  } else {
                    $msg.attr('class', 'text-danger').text('Error, Try Again');
                  }
                }).fail(function (object) {
                  if (object.responseText === 'Unauthorized') {
                    window.alert("Please Login First");
                    window.location.replace('/admin');
                  }
                })
              }
              else {

              }
            })
          });

          $('#courseButton').click(function () {
            $form.text("");
            $msg.text("");
            $.get('/api/tutors', function (tutors) {
              if (tutors.success === 'true' && tutors.data.length > 0) {
                $.get("/api/extra/filters", function (filters) {
                  if (filters.isSuccess === 'true'
                    && filters.classObject.length > 0
                    && filters.subjectObject.length > 0 &&
                    filters.courseObject.length > 0 &&
                    filters.categoryObject.length > 0) {
                    $form.append(`
                    <label>
                    Name of the Course: <input type="text"  style=" width:600px" id="minicourse-name"  required>
                    </label>
                    <br><br>
                    <label>
                    No. of lessons: <input type="text" id="minicourse-no-of-lessons" required>
                    </label>
                    <br><br>
                    <label>
                    Description: <br><textarea cols="100" rows="10" id="minicourse-description"  required></textarea>
                    </label>
                    <br><br>
                    <label>
                    Duration of the Course: <input type="text" id="minicourse-duration" required>
                    </label>
                    <br><br>
                    <label>
                    Level:
                    <label><input type="radio" name="level" value="Beginner" required> Beginner</label>
                    <label><input type="radio" name="level" value="Intermediate"> Intermediate</label>
                    <label><input type="radio" name="level" value="Advance"> Advance</label>
                    </label>
                    <br><br>
                    <label>
                    Medium:
                    <label><input type="radio" name="medium" value="English" required> English</label>
                    <label><input type="radio" name="medium" value="Hindi"> Hindi</label>
                    </label><br><br>
                   `);
                    let tutorString = "<label>Tutor : ";

                    for (let i = 0; i < tutors.data.length; i++) {
                      tutorString += `<label><input type="radio" name="tutor" value="` + tutors.data[i].id + `"> ` + tutors.data[i].name + ` </label> `
                    }

                    tutorString += `</label><br><br>`;

                    let classString = "<label>Class : ";
                    for (let i = 0; i < filters.classObject.length; i++) {
                      classString += `<label><input type="radio" name="class" value="` + filters.classObject[i].id + `"> ` + filters.classObject[i].className + ` </label> `
                    }

                    classString += `</label><br><br>`;

                    let subjectString = "<label>Subject : ";
                    for (let i = 0; i < filters.subjectObject.length; i++) {
                      subjectString += `<label><input type="radio" name="subject" value="` + filters.subjectObject[i].id + `"> ` + filters.subjectObject[i].subjectName + ` </label> `
                    }

                    subjectString += `</label><br><br>`;

                    let courseString = "<label>Chapter : ";
                    for (let i = 0; i < filters.courseObject.length; i++) {
                      courseString += `<label><input type="radio" name="course" value="` + filters.courseObject[i].id + `"> ` + filters.courseObject[i].courseName + ` </label> `
                    }

                    courseString += `</label><br><br>`;

                    let categoryString = "<label>Category : ";
                    for (let i = 0; i < filters.categoryObject.length; i++) {
                      categoryString += `<label><input type="checkbox" name="category" value="` + filters.categoryObject[i].id + `"> ` + filters.categoryObject[i].categoryName + ` </label> `
                    }

                    categoryString += `</label><br><br>`;

                    let material = '<label> Upload Materials <input type="file" name="material" >';

                    $form.append(tutorString + classString + subjectString + courseString + 
                                  categoryString + material);
                    $form.append(`<ol id="lessons-list"></ol>
                            <button class="btn buttons" id="add-lesson">Add Lesson</button>
                            `);
                    $form.append(`<button class="btn buttons" id="submit">Submit</button>`);
                    $submit = $('#submit');
                    $submit.unbind('click');
                    let counter = 0;
                    $('#add-lesson').click(function () {
                      $('#lessons-list').append(`
<li>
                            <label>
        Name of the Lesson: <input type="text" style=" width:600px" id="lesson-` + counter + `-name"  required>
    </label>
    <br><br>
    <label>
        Video URL: <input type="text" style=" width:800px" id="lesson-` + counter + `-videourl" required>
    </label>
    <br><br>
    <label>
       Description: <br><textarea cols="100" rows="4" id="lesson-` + counter + `-description" required></textarea>
    </label>
    <br><br>
    <label>
        Duration of the minicourse: <input type="text" id="lesson-` + counter + `-duration" required>
    </label>
    <br><br>
    <label>
        Level:
        <label><input type="radio" name="lessonlevel` + counter + `" value="Beginner" required> Beginner</label>
        <label><input type="radio" name="lessonlevel` + counter + `" value="Intermediate"> Intermediate</label>
        <label><input type="radio" name="lessonlevel` + counter + `" value="Advance"> Advance</label>
    </label>
    <br><br>
    
        </li>`);


                      counter++;
                    });

                    console.log(1);
                    $submit = $('#submit');
                    $submit.unbind('click');
                    $submit.click(function () {

                      categoryIds = [];
                      $('input[name=category]:checked').each(function () {
                        categoryIds.push($(this).val());
                      });
                      console.log(2);
                      tutorId = $('input[name="tutor"]:checked').val();
                      miniCourseData = {
                        name: $('#minicourse-name').val(),
                        noOfLessons: $('#minicourse-no-of-lessons').val(),
                        description: $('#minicourse-description').val(),
                        level: $('input[name="level"]:checked').val(),
                        duration: $('#minicourse-duration').val(),
                        medium: $('input[name="medium"]:checked').val(),
                        classId: $('input[name="class"]:checked').val(),
                        subjectId: $('input[name="subject"]:checked').val(),
                        courseId: $('input[name="course"]:checked').val(),
                        categoryIds: categoryIds
                        
                      };

                      if (miniCourseData.name === '') {
                        $msg.attr('class', 'text-danger').text("Please fill the name");
                        return;
                      }

                      if (miniCourseData.noOfLessons === '') {
                        $msg.attr('class', 'text-danger').text("Please fill the no of lessons");
                        return;
                      }
                      if (miniCourseData.description === '') {
                        $msg.attr('class', 'text-danger').text("Please fill the description");
                        return;
                      }
                      if (miniCourseData.duration === '') {
                        $msg.attr('class', 'text-danger').text("Please fill the duration");
                        return;
                      }
                      if (!miniCourseData.level) {
                        $msg.attr('class', 'text-danger').text("Please select the level");
                        return;
                      }
                      if (!miniCourseData.medium) {
                        $msg.attr('class', 'text-danger').text("Please select the medium");
                        return;
                      }

                      if (!tutorId) {
                        $msg.attr('class', 'text-danger').text("Please select the tutor");
                        return;
                      }
                      if (!miniCourseData.classId) {
                        $msg.attr('class', 'text-danger').text("Please select the class");
                        return;
                      }

                      if (!miniCourseData.subjectId) {
                        $msg.attr('class', 'text-danger').text("Please select the subject");
                        return;
                      }
                      if (!miniCourseData.courseId) {
                        $msg.attr('class', 'text-danger').text("Please select the chapter");
                        return;
                      }


                      if (miniCourseData.categoryIds.length === 0) {
                        $msg.attr('class', 'text-danger').text("Please select the categories");
                        return;
                      }

                      $.ajax({
                        url: "/api/tutors/" + tutorId + "/addMiniCourse",
                        data: miniCourseData,
                        method: 'POST',
                        headers: {
                          "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                      }).done(function (miniCourseFinal) {

                        let lessonData = [];
                        console.log(miniCourseFinal);
                        if (miniCourseFinal.success === 'false' && miniCourseFinal.message === 'Admin Only') {
                          console.log("hey there");
                          window.alert("Only Admins are allowed");
                          window.location.replace('/admin');
                        }
                        console.log(miniCourseFinal.msg);
                        console.log("*********")
                        console.log(miniCourseFinal.success)
                        if (miniCourseFinal.success === 'false') {
                          console.log("reached")
                          $form.text('');
                          console.log("appending")
                          $msg.attr('class', 'text-danger').text(miniCourseFinal.msg);
                          console.log("appended")
                        }
                        else {

                          success = miniCourseFinal.success;
                          message = miniCourseFinal.msg;
                          miniCourseFinal = miniCourseFinal.data;
                          for (let i = 0; i < counter; i++) {
                            lessonData.push({
                              name: $('#lesson-' + i + '-name').val(),
                              videoUrl: $('#lesson-' + i + '-videourl').val(),
                              level: $('input[name="lessonlevel' + i + '"]:checked').val(),
                              duration: $('#lesson-' + i + '-duration').val(),
                              description: $('#lesson-' + i + '-description').val(),
                              minicourseId: miniCourseFinal.id
                            })
                          }
                          if (lessonData.length !== 0) {
                            console.log("/api/tutors/" + tutorId + "/" + miniCourseFinal.id + "/addLesson")
                            $.ajax({
                              url: "/api/tutors/" + tutorId + "/" + miniCourseFinal.id + "/addLesson",
                              data: {lessons: lessonData},
                              method: 'POST',
                              headers: {
                                "Authorization": "Bearer " + localStorage.getItem("token")
                              }
                            }).done(function (lessons) {
                              $form.text('');
                              console.log(lessons);
                              if (lessons.success === 'true') {
                                $form.text('');
                                $msg.attr('class', 'text-success').text('Course and lessons Added');
                              } else {
                                $msg.attr('class', 'text-danger').text('Error, Try Again');
                              }
                            }).fail(function (object) {
                              if (object.responseText === 'Unauthorized') {
                                window.alert("Please Login First");
                                window.location.replace('/');
                              }
                            })
                          }
                          else {
                            $form.text('');
                            if (success === 'true') {
                              $form.text('');
                              $msg.attr('class', 'text-success').text('Course Added');
                            } else {
                              $msg.attr('class', 'text-danger').text(message);
                            }
                          }
                        }
                      }).fail(function (object) {
                        if (object.responseText === 'Unauthorized') {
                          window.alert("Please Login First");
                          window.location.replace('/admin');
                        }
                      })
                    })
                  }
                  else {
                    $msg.text("Please add filters first");
                  }
                });
              } else {
                $msg.attr('class', 'text-danger').text('Please Add A Tutor First');
              }
            });
          });

          $('#viewCoursesButton').click(function () {
            $form.text("");
            $msg.text("");
            $.get("/api/minicourses", function (minicourses) {
              $form.append(`<ul id="minicourses-list" class="list-group" ></ul>`);
              const $minicourses_list = $('#minicourses-list');
              minicourses.forEach(function (minicourse) {
                let name = minicourse.name.split(" ").join("-");
                $minicourses_list.append(`
                          <li class="list-group-item"  miniCourseId="` + minicourse.id + `">
                          <span>` + minicourse.name + `</span>
                          <a class="btn btn-outline-success view" style="margin-left: 50px" target = "_blank" href="/courses/` + minicourse.id + `/` + name + `">View</a>
                          <button class="btn btn-outline-info edit" style="margin-left: 20px">Edit</button>
                          <button class="btn btn-outline-danger delete" style="margin-left: 20px">Delete</button>
                          <button class="btn btn-outline-info add-lesson" style="margin-left: 20px">Add Lesson</button>
                          </li>
                        `)
              });
              $('.edit').click(function (e) {
                let miniCourseId = e.target.parentElement.getAttribute('miniCourseId');
                console.log(miniCourseId)
                $form.text("");
                $msg.text("");
                $.get('/api/tutors', function (tutors) {
                  if (tutors.success === 'true' && tutors.data.length > 0) {
                    $.get("/api/extra/filters", function (filters) {
                      if (filters.isSuccess === 'true'
                        && filters.classObject.length > 0
                        && filters.subjectObject.length > 0 &&
                        filters.courseObject.length > 0 &&
                        filters.categoryObject.length > 0) {
                        $.get("/api/minicourses/" + miniCourseId, function (miniCourse) {
                          $form.append(`
                    <label>
                    Name of the Course: <input type="text"  style=" width:600px" id="minicourse-name"  required>
                    </label>
                    <br><br>
                    <label>
                    No. of lessons: <input type="text" id="minicourse-no-of-lessons" required>
                    </label>
                    <br><br>
                    <label>
                    Description: <br><textarea cols="100" rows="10" id="minicourse-description"  required></textarea>
                    </label>
                    <br><br>
                    <label>
                    Duration of the Course: <input type="text" id="minicourse-duration" required>
                    </label>
                    <br><br>
                    <label>
                    Level:
                    <label><input type="radio" name="level" value="Beginner" required> Beginner</label>
                    <label><input type="radio" name="level" value="Intermediate"> Intermediate</label>
                    <label><input type="radio" name="level" value="Advance"> Advance</label>
                    </label>
                    <br><br>
                    <label>
                    Medium:
                    <label><input type="radio" name="medium" value="English" required> English</label>
                    <label><input type="radio" name="medium" value="Hindi"> Hindi</label>
                    </label><br><br>
                   `);
                          let tutorString = "<label>Tutor : ";


                          for (let i = 0; i < tutors.data.length; i++) {
                            tutorString += `<label><input type="radio" name="tutor" value="` + tutors.data[i].id + `"> ` + tutors.data[i].name + ` </label> `
                          }

                          tutorString += `</label><br><br>`;

                          let classString = "<label>Class : ";
                          for (let i = 0; i < filters.classObject.length; i++) {
                            classString += `<label><input type="radio" name="class" value="` + filters.classObject[i].id + `"> ` + filters.classObject[i].className + ` </label> `
                          }

                          classString += `</label><br><br>`;

                          let subjectString = "<label>Subject : ";
                          for (let i = 0; i < filters.subjectObject.length; i++) {
                            subjectString += `<label><input type="radio" name="subject" value="` + filters.subjectObject[i].id + `"> ` + filters.subjectObject[i].subjectName + ` </label> `
                          }

                          subjectString += `</label><br><br>`;

                          let courseString = "<label>Chapter : ";
                          for (let i = 0; i < filters.courseObject.length; i++) {
                            courseString += `<label><input type="radio" name="course" value="` + filters.courseObject[i].id + `"> ` + filters.courseObject[i].courseName + ` </label> `
                          }

                          courseString += `</label><br><br>`;

                          let categoryString = "<label>Category : ";
                          for (let i = 0; i < filters.categoryObject.length; i++) {
                            categoryString += `<label><input type="checkbox" name="category" value="` + filters.categoryObject[i].id + `"> ` + filters.categoryObject[i].categoryName + ` </label> `
                          }

                          categoryString += `</label><br><br>`;
                          $form.append(tutorString + classString + subjectString + courseString + categoryString);
                          $('#minicourse-name').val(miniCourse.name);
                          $('#minicourse-no-of-lessons').val(miniCourse.noOfLessons);
                          $('#minicourse-description').val(miniCourse.description);
                          $('#minicourse-duration').val(miniCourse.duration);
                          $('input[value="' + miniCourse.medium + '"]').prop('checked', true);
                          $('input[value="' + miniCourse.level + '"]').prop('checked', true);
                          $('input[ name = "tutor"][ value="' + miniCourse.tutor.id + '"]').prop('checked', true);
                          $('input[ name = "class"][ value="' + miniCourse.tag.class.id + '"]').prop('checked', true);
                          $('input[ name = "subject"][ value="' + miniCourse.tag.subject.id + '"]').prop('checked', true);
                          $('input[ name = "course"][ value="' + miniCourse.tag.course.id + '"]').prop('checked', true);
                          categories = miniCourse.minicoursecategories;
                          for (category of categories) {
                            $('input[ name = "category"][ value="' + category.category.id + '"]').prop('checked', true);
                          }

                          $form.append(`<ul id="lessons-list" class="list-group" ></ul>`);
                          const $lessons_list = $('#lessons-list');
                          console.log(miniCourse.lessons)
                          miniCourse.lessons.forEach(function (lesson) {
                            $lessons_list.append(`
                                              <li class="list-group-item"  lessonId="` + lesson.id + `">
                                              <span>` + lesson.name + `</span>
                                              <button class="btn btn-outline-info edit-lesson" style="margin-left: 20px">Edit</button>
                                              <button class="btn btn-outline-danger delete-lesson" style="margin-left: 20px">Delete</button>
                                              </li>
                                            `);
                          });
                          $('.edit-lesson').click(function (e) {
                            let lessonId = parseInt(e.target.parentElement.getAttribute('lessonId'));
                            console.log(lessonId);
                            console.log(miniCourse);
                            var finalLesson = {};
                            miniCourse.lessons.forEach(function (lesson) {
                              if (lesson.id === lessonId) {
                                finalLesson = lesson
                              }

                            });

                            $form.text("");
                            $msg.text("");

                            $form.append(`
                             <label>
         Name of the Lesson: <input type="text" style=" width:600px" id="lesson-name"  required>
     </label>
     <br><br>
     <label>
         Video URL: <input type="text" style=" width:800px" id="lesson-videourl" required>
     </label>
     <br><br>
     <label>
         Description: <br><textarea cols="100" rows="4" id="lesson-description" required></textarea>
     </label>
     <br><br>
     <label>
         Duration of the minicourse: <input type="text" id="lesson-duration" required>
     </label>
     <br><br>
     <label>
         Level:
         <label><input type="radio" name="lessonlevel" value="Beginner" required> Beginner</label>
         <label><input type="radio" name="lessonlevel" value="Intermediate"> Intermediate</label>
         <label><input type="radio" name="lessonlevel" value="Advance"> Advance</label>
     </label>
     <br><br>
 `);

                            console.log(finalLesson);
                            $('#lesson-name').val(finalLesson.name);
                            $('#lesson-videourl').val(finalLesson.videoUrl);
                            $('input[value="' + finalLesson.level + '"]').prop('checked', true);
                            $('#lesson-duration').val(finalLesson.duration);
                            $('#lesson-description').val(finalLesson.description);
                            $form.append(`<button class="btn buttons" id="save">Save</button>`);
                            $save = $('#save');
                            $save.unbind('click');

                            $save.click(function () {
                              $.ajax({
                                  url: "/api/lessons/" + finalLesson.id,
                                  data: {
                                    name: $('#lesson-name').val(),
                                    videoUrl: $('#lesson-videourl').val(),
                                    level: $('input[name="lessonlevel"]:checked').val(),
                                    duration: $('#lesson-duration').val(),
                                    description: $('#lesson-description').val()
                                  },
                                  method: 'PUT',
                                  headers: {
                                    "Authorization": "Bearer " + localStorage.getItem("token")
                                  }
                                }
                              ).done(function (data) {
                                $form.text('');
                                console.log(data);
                                if (data.success === 'true') {
                                  $form.text('');
                                  $msg.attr('class', 'text-success').text('Lesson Updated');
                                } else {
                                  $msg.text("Error, Try again!");
                                  $msg.attr('class', 'text-danger').text('Error, Try Again');
                                }
                              })
                            })
                          });


                          $('.delete-lesson').click(function (e) {
                            let lessonId = e.target.parentElement.getAttribute('lessonId');
                            $.ajax({
                              url: "/api/lessons/" + lessonId,
                              method: 'DELETE',
                              headers: {
                                "Authorization": "Bearer " + localStorage.getItem("token")
                              }
                            }).done(function (data) {
                              $form.text('');
                              if (data.success === 'true') {
                                $msg.attr('class', 'text-success').text('Lesson deleted');
                              } else {
                                $msg.attr('class', 'text-danger').text(miniCourse);
                              }
                            })
                          });

                          $form.append(`<button class="btn buttons" id="save">Save</button>`);
                          $save = $('#save');
                          $save.unbind('click');
                          // let counter = 0;
                          $save.click(function () {
                            categoryIds = [];
                            $('input[name=category]:checked').each(function () {
                              categoryIds.push($(this).val());
                            });
                            tutorId = $('input[name="tutor"]:checked').val();
                            miniCourseData = {
                              name: $('#minicourse-name').val(),
                              noOfLessons: $('#minicourse-no-of-lessons').val(),
                              description: $('#minicourse-description').val(),
                              level: $('input[name="level"]:checked').val(),
                              duration: $('#minicourse-duration').val(),
                              medium: $('input[name="medium"]:checked').val(),
                              classId: $('input[name="class"]:checked').val(),
                              subjectId: $('input[name="subject"]:checked').val(),
                              courseId: $('input[name="course"]:checked').val(),
                              categoryIds: categoryIds

                            };

                            $.ajax({
                              url: "/api/tutors/" + tutorId + "/" + miniCourseId + "/edit",
                              data: miniCourseData,
                              method: 'POST',
                              headers: {
                                "Authorization": "Bearer " + localStorage.getItem("token")
                              }
                            }).done(function (miniCourseFinal) {
                              // let lessonData = [];
                              // console.log(miniCourseFinal);
                              // miniCourseFinal = miniCourseFinal.data;
                              // for (let i = 0; i < counter; i++) {
                              //     lessonData.push({
                              //         name: $('#lesson-' + i + '-name').val(),
                              //         videoUrl: $('#lesson-' + i + '-videourl').val(),
                              //         level: $('input[name="lessonlevel"]:checked').val(),
                              //         duration: $('#lesson-' + i + '-duration').val(),
                              //         description: $('#lesson-' + i + '-description').val(),
                              //         minicourseId: miniCourseFinal.id
                              //     })
                              // }
                              // if (lessonData.length !== 0) {
                              //     console.log("/api/tutors/" + tutorId + "/" + miniCourseFinal.id + "/addLesson")
                              //     $.ajax({
                              //         url: "/api/tutors/" + tutorId + "/" + miniCourseFinal.id + "/addLesson",
                              //         data: {lessons: lessonData},
                              //         method: 'POST',
                              //         headers: {
                              //             "Authorization": "Bearer " + localStorage.getItem("token")
                              //         }
                              //     }).done(function (lessons) {
                              //         $form.text('');
                              //         console.log(lessons);
                              //         if (lessons.success === 'true') {
                              //             $form.text('');
                              //             $msg.attr('class', 'text-success').text('Course and lessons Added');
                              //         } else {
                              //             $msg.attr('class', 'text-danger').text('Error, Try Again');
                              //         }
                              //     }).fail(function (object) {
                              //         if (object.responseText === 'Unauthorized') {
                              //             window.alert("Please Login First");
                              //             window.location.replace('/');
                              //         }
                              //     })
                              // }
                              // else {
                              //     $form.text('');
                              if (miniCourseFinal.success === 'true') {
                                $form.text('');
                                $msg.attr('class', 'text-success').text('Course changes saved');
                              } else {
                                $msg.attr('class', 'text-danger').text('Error, Try Again');
                              }
                              // }
                            }).fail(function (object) {
                              if (object.responseText === 'Unauthorized') {
                                window.alert("Please Login First");
                                window.location.replace('/admin');
                              }
                            })
                          })

                        });

                      } else {
                        $msg.text("Error, Try Again");
                      }
                    })
                  } else {
                    $msg.attr('class', 'text-danger').text('Error, Try Again');
                  }
                })
              })
              $('.delete').click(function (e) {
                let miniCourseId = e.target.parentElement.getAttribute('miniCourseId');
                $.ajax({
                  url: "/api/minicourses/" + miniCourseId,
                  method: 'DELETE',
                  headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                  }
                }).done(function (miniCourse) {
                  if (miniCourse.success === 'true') {
                    $form.text('');
                    $msg.attr('class', 'text-success').text('Course and its lessons are deleted');
                  } else {
                    $msg.attr('class', 'text-danger').text(miniCourse);
                  }
                })
              })
              $('.add-lesson').click(function (e) {
                let miniCourseId = e.target.parentElement.getAttribute('miniCourseId');
                console.log(miniCourseId)
                $form.text("");
                $msg.text("");

                $form.append(`
                            <label>
        Name of the Lesson: <input type="text" style=" width:600px" id="lesson-name"  required>
    </label>
    <br><br>
    <label>
        Video URL: <input type="text" style=" width:800px" id="lesson-videourl" required>
    </label>
    <br><br>
    <label>
       Description: <br><textarea cols="100" rows="4" id="lesson-description" required></textarea>
    </label>
    <br><br>
    <label>
        Duration of the minicourse: <input type="text" id="lesson-duration" required>
    </label>
    <br><br>
    <label>
        Level:
        <label><input type="radio" name="lessonlevel" value="Beginner" required> Beginner</label>
        <label><input type="radio" name="lessonlevel" value="Intermediate"> Intermediate</label>
        <label><input type="radio" name="lessonlevel" value="Advance"> Advance</label>
    </label>
    <br><br>
    
        `);

                $form.append(`<button class="btn buttons" id="submit">Submit</button>`);
                $submit = $('#submit');
                $submit.unbind('click');

                $submit.click(function () {
                  $.ajax({
                      url: "/api/minicourses/" + miniCourseId + "/addLesson",
                      data: {
                        name: $('#lesson-name').val(),
                        videoUrl: $('#lesson-videourl').val(),
                        level: $('input[name="lessonlevel"]').val(),
                        duration: $('#lesson-duration').val(),
                        description: $('#lesson-description').val()
                      },
                      method: 'POST',
                      headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                      }
                    }
                  ).done(function (data) {
                    console.log(data);
                    if (data.success === 'true') {
                      $msg.attr('class', 'text-success').text('Lesson Added');
                    } else {
                      $msg.attr('class', 'text-danger').text(data.msg);
                    }
                  })
                })


              })
            });
          })
        }
        else {
          alert("You are not allowed");
          window.location.replace("/");
        }
      }
    ).fail(function (object) {
      if (object.responseText === 'Unauthorized') {
        window.alert("Please Login First");
        window.location.replace('/');
      }
    })
  }
)
;
