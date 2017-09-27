$(document).ready(function () {

  function addScript(src) {
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.src = src;
          document.getElementsByTagName('head')[0].appendChild(s);
          console.log("FN called");
      }

  $('#name').text(localStorage.getItem('name'));

  const lessonId = window.location.pathname.split('/lessons/')[1].split('/')[0];

  $('#report').click(function () {
    $('#reportModal').modal('show');


    $('#submit-report').click(function () {
    let value  = $('#report-description').val();
      if(value === ''){
       $('#report-modal-body').append('<div class="row" style="margin-bottom: 0"><span class="text-danger" style="padding-left: 15px">Tell us about your issue so that we can fix it.</span></div>')
      }else {
          $.ajax({
              url: `/api/lessons/${lessonId}/report`,
              method: 'POST',
              data: {
                  description: value
              },
              headers: {
                  "Authorization": "Bearer " + localStorage.getItem("token")
              }
          }).done(function (data) {
              if (data.success === 'true') {
                  $('#reportModal').modal('hide');
                  $('#submit-report-msg').attr('class', 'text-success');
                  $('#reportModal-description').val('');
                  $('#reportSubmitModal').modal('show');

              } else {
                  window.alert('Please Try Again')
              }

          }).fail(function (object) {
              if (object.responseText === 'Unauthorized') {
                  window.alert('Please Login First');
                  window.location.replace('/');
              }
          });
      }
    });


  });


  $.ajax({
    url: "/api/lessons/" + lessonId,
    method: 'GET',
    headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
  }).done(function (data) {
    if (data.success === 'true') {
      const lesson = data.lesson;
      $.ajax({
        url: "/api/minicourses/" + lesson.minicourseId,
        method: 'GET',
        headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
      }).done(function (miniCourse) {
          let name = miniCourse.name.split(" ").join("-");
          let minicoursename = $('#miniCourseName')
          minicoursename.text(miniCourse.name);
        minicoursename.click(function () {
          window.location.replace('/courses/' + miniCourse.id + '/' + name)
        })
        $('#noOfLessons').text(miniCourse.noOfLessons + ' Lectures');
        $('#miniCourseDuration').text(miniCourse.duration);
        console.log(lesson.videoUrl);
        $('#video').attr('src', lesson.videoUrl);
        $('#nameOfTheMiniCourse').text(lesson.name);
        $('#durationOfMiniCourse').text(lesson.duration);

        $('#totalUpvotes').text(lesson.upvotes + " upvotes");
        $('#lessonDescription').text(lesson.description);

        if (miniCourse.tutor.img != null) {
          $('#teacherImage').attr('src', "/images/"+miniCourse.tutor.img+".jpg");
        }
        $('#nameOfTheTeacher').text(miniCourse.tutor.name);
        $('#teacherDescription').text(miniCourse.tutor.description);


        $.ajax({
          url: '/api/lessons/' + lessonId + '/isBookmarked',
          method: 'GET',
          headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
        }).done(function (data) {
          const bookmark = $('#bookmark');
          console.log(data);
          if (data.isBookmarked === 'true') {
            console.log(1);
            bookmark.text("BOOKMARKED");
            bookmark.click(function () {
              $('#msg').attr('class', 'text-success').text("Already Bookmarked");
            });
          } else if (data.isBookmarked === 'false') {
            bookmark.click(function () {

              $.ajax({
                url: "/api/lessons/" + lessonId + "/bookmark",
                method: 'POST',
                headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
              }).done(function (bookmarked) {
                console.log("enrol fn");
                if (bookmarked.success === 'true') {
                  bookmark.text("BOOKMARKED");
                  bookmark.unbind('click');
                  $('#msg').text("");
                  bookmark.click(function () {
                    $('#msg').attr('class', 'text-success').text("Already Bookmarked");
                  });
                } else {
                  $('#msg').attr('class', 'text-danger').text("Bookmark Again");
                }
              }).fail(function (object) {
                if (object.responseText === 'Unauthorized') {
                  window.alert("Please Login First");
                  window.location.replace('/');
                }
              })
            })
          } else if (data.success === 'false') {
            $('#msg').attr('class', 'text-danger').text("Bookmark Again");

          }           

        }).then( function(obj) {
          console.log("DONE");
          var ss = "index2.js";
          addScript(ss);          
    }).fail(function (object) {
          const bookmark = $('#bookmark');
          bookmark.click(function () {
            window.alert("Please Login First");
            window.location.replace('/')
          });
        });


        $.ajax({
          url: '/api/lessons/' + lessonId + '/isUpvoted',
          method: 'GET',
          headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
        }).done(function (data) {
          const upvote = $('#upvote');
          const upvotelogo = $('#upvote-logo');
          const upvotetext = $('#upvote-text');
          console.log(data);
          if (data.success === 'true') {
            console.log("yay");
            upvotelogo.attr("src", "/images/thumb-up.png");
            upvotetext.text("Upvoted")
            upvote.click(function () {
              // $('#msg').attr('class', 'text-success').text("Already Bookmarked");
            });
          } else if (data.success === 'false') {
            upvote.click(function () {

              $.ajax({
                url: "/api/lessons/" + lessonId + "/upvote",
                method: 'POST',
                headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
              }).done(function (bookmarked) {
                console.log("enrol fn");
                if (bookmarked.success === 'true') {
                  upvotelogo.attr("src", "/images/thumb-up.png");
                  upvotetext.text("Upvoted");
                  let totalUpvotes = $('#totalUpvotes');
                  let upvotes = parseInt(totalUpvotes.text().split(" ")[0]);
                  totalUpvotes.text((upvotes + 1) + " upvotes");
                  upvote.unbind('click');
                  // $('#msg').text("");
                  upvote.click(function () {
                    // $('#msg').attr('class', 'text-success').text("Already Bookmarked");
                  });
                } else {
                  // $('#msg').attr('class', 'text-danger').text("Bookmark Again");
                }
              }).fail(function (object) {
                if (object.responseText === 'Unauthorized') {
                  window.alert("Please Login First");
                  window.location.replace('/');
                }
              })
            })
          } else if (data.success === 'false') {
            // $('#msg').attr('class', 'text-danger').text("Bookmark Again");

          }


        }).fail(function (object) {
          const bookmark = $('#bookmark');
          bookmark.click(function () {
            window.alert("Please Login First");
            window.location.replace('/')
          });
        });


        const lessons = $('#lessons');
        for (let i = 0; i < miniCourse.lessons.length; i++) {
          if (miniCourse.lessons[i].id !== lesson.id) {
              let name =  miniCourse.lessons[i].name.split(" ").join("-");
            lessons.append(`<div class="col-sm-12" style="cursor: pointer;height: auto;padding: 20px;border-bottom: solid 2px #EEEEEE;" onclick="window.location='/lessons/` + miniCourse.lessons[i].id +`/`+ name + `'">
                    <h5 style="font-size: 14px;margin-bottom: 0;font-weight: 500;color: #A4A5A9">` + (i + 1) + `. ` + miniCourse.lessons[i].name + `<br></h5>
                </div>`)
          } else {
            lessons.append(`<div class="col-sm-12" style="height: auto;padding: 20px;border-bottom: solid 2px #EEEEEE;">
                    <h5 style="font-size: 14px;margin-bottom: 0;font-weight: 500;color: #1589EE">` + (i + 1) + `. ` + miniCourse.lessons[i].name + `<br></h5>

                </div>`)
          }
        }

      }).fail(function (object) {
        if (object.responseText === 'Unauthorized') {
          window.alert("Please Login First");
          window.location.replace('/');
        }
      })
    } else {
      alert("Please enroll for the course first");
      window.location.replace('/courses/' + data.miniCourseId);
//FIXME :
    }
  }).fail(function (object) {
    if (object.responseText === 'Unauthorized') {
      window.alert("Please Login First");
      window.location.replace('/');
    }
  })
});
