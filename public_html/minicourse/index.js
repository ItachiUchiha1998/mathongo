let isEnrolled = false;
let reviewed = false;
$(document).ready(function () {

  $.ajax({
    url: '/checkLoggedIn',
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }).done(function (data) {

    if (data.success === 'true') {
      $('#name').text(localStorage.getItem('name'));
    } else {
      $('#userDetails').remove();
      $('#header-bar').append(`<div class=" col-sm-2 col-12 align-middle header-links-div"><a
                class="align-middle header-links" href="/">Register / Login</a></div>`)

    }
  }).fail(function (object) {
    if (object.responseText === 'Unauthorized') {
      $('#userDetails').remove();
      $('#header-bar').append(`<div class=" col-sm-2 col-12 align-middle header-links-div"><a
                class="align-middle header-links" href="/">Register / Login</a></div>`)
    }
  });



  const miniCourseId = window.location.pathname.split('/courses/')[1].split('/')[0];


  $.get("/api/minicourses/" + miniCourseId, function (miniCourse) {
    console.log(miniCourse);
    $('#miniCourseName').text(miniCourse.name);
    $('#miniCourseDescription').text(miniCourse.description);
    $('#teacherName').text(miniCourse.tutor.name);
    $('#upper-rating').jRate({
      rating: Math.floor(+miniCourse.rating),
      startColor: '#FFD700',
      endColor: '#FFD700',
      height: 15,
      readOnly: true
    });
    $('#noOfReviews').text(miniCourse.noOfReviews + ' Reviews');
    $('#subject').text(miniCourse.tag.subject.subjectName);
    $('#className').text(miniCourse.tag.class.className);
    $('#miniCourseDuration').text(miniCourse.duration);
    $('#difficulty').text(miniCourse.level);
    $('#medium').text(miniCourse.medium);
    $('#relevance').text(miniCourse.minicoursecategories.map((i) => i.category.categoryName).join(', '));
    if (miniCourse.tutor.img != null) {

      $('#teacherImage').attr('src', "/images/"+miniCourse.tutor.img+".jpg");
      $('#teacher-img').attr('src', "/images/"+miniCourse.tutor.img+".jpg");
    }
    $('#nameOfTheTeacher').text(miniCourse.tutor.name);
    $('#teacherDescription').text(miniCourse.tutor.description);

    const $lowerRating = $('#lower-rating');
    var noOfEachRating = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < miniCourse.reviews.length; i++) {
      noOfEachRating[(+miniCourse.reviews[i].rating)]++;
    }

    $('#jRate-add-review').jRate({
      rating: 5,
      startColor: '#FFD700',
      endColor: '#FFD700',
      height: 30,
      precision: 1,
      shapeGap: '5px',
      onChange: function (rating) {
        $('#review-type').text((rating === 5 ? 'Very Good' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Bad' : rating === 1 ? 'Poor' : ''))
      }
    });


    $('#jRate-rating').jRate({
      rating: Math.floor(+miniCourse.rating),
      startColor: '#FFD700',
      endColor: '#FFD700',
      height: 20,
      readOnly: true,
      shapeGap: '10px'
    });

    $('#jRate-rating-vertical').jRate({
      rating: 5,
      startColor: '#FFD700',
      endColor: '#FFD700',
      height: 20,
      readOnly: true,
      shapeGap: '10px',
      horizontal: false
    });

    $('#submit-review').click(function () {
      let text = $('#review-type').text();
      let rating = (text === 'Very Good' ? 5 : text === 'Good' ? 4 : text === 'Average' ? 3 : text === 'Bad' ? 2 : text === 'Poor' ? 1 : 0);
      console.log(rating)
      $.ajax({
        url: '/api/reviews/' + miniCourseId,
        method: 'POST',
        data: {
          rating: rating,
          description: $('#review-description').val(),
        },
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      }).done(function (data) {
        if (data.success === true) {

          $('#reviewModal').modal('hide');
          $('#submit-review-msg').attr('class', 'text-success');
          $('#review-description').val('');
          $('#reviewSubmitModal').modal('show');
          $('#reviewSubmitModal').on('hidden.bs.modal', function () {
            location.reload();
          });

        } else {
          window.alert('Please Try Again')
        }

      }).fail(function (object) {
        if (object.responseText === 'Unauthorized') {
          window.alert('Please Login First');
          window.location.replace('/');
        }
      });

    }); 

    $.ajax({
      url: '/api/minicourses/' + miniCourseId + '/isEnrolled',
      method: 'GET',
      headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
    }).done(function (enrollment) {

      console.log(enrollment);
      const enroll = $('#enroll');
      if (enrollment.isEnrolled === 'true') {
        console.log(1);
        enroll.text("Enrolled");
        isEnrolled = true;
        const $lowerRating = $('#lower-rating');
        
        $.ajax({
        url: '/api/reviews/isReviewed/' + miniCourseId,
        method: 'GET',
        headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
      }).done(function(reviewed) {
        console.log(reviewed);
        const $lowerRating = $('#lower-rating');
        if(reviewed.isReviewed === "true") {
          $lowerRating.append(`Course Rated`);
        } else {
          $lowerRating.append(
            `<h4 style=";margin-bottom: 7px; color: #444; font-weight: 500;padding-top: 5px"><b>${miniCourse.rating.toFixed(1)}</b><br></h4>
            <div id="jRate-rating"></div>   
            <p style="color: #999;font-weight: 500;border: none !important;padding: 5px;font-size: 12px">${(miniCourse.noOfRatings !== null ? miniCourse.noOfRatings : 0)} Ratings</p>
            <div class="row">
                <div class="col-sm-1" id="jRate-rating-vertical" style="float: left;"></div>
                <div class="col-sm-10 p-0">
                    <div class="row" style="height: 30px">
                        <p class="col-sm-1 px-0" style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 4px;font-size: 12px">5</p>
                        <div class="progress col-sm-9 p-0" style="margin-top: 6px;height: 10px">
                            <div class="progress-bar" style="width: ${(noOfEachRating[5] * 100) / miniCourse.noOfRatings}%;">
                                
                            </div>
                        </div>
                        <p class="col-sm-1 px-0 " style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 10px;font-size: 12px">${noOfEachRating[5]}</p>
                    </div>
                    <div class="row" style="height: 30px">
                        <p class="col-sm-1 px-0" style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 4px;font-size: 12px">4</p>
                        <div class="progress col-sm-9 p-0" style="margin-top: 6px;height: 10px">
                            <div class="progress-bar" style="width: ${(noOfEachRating[4] * 100) / miniCourse.noOfRatings}%;">
                                
                            </div>
                        </div>
                        <p class="col-sm-1 px-0 " style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 10px;font-size: 12px">${noOfEachRating[4]}</p>
                    </div>
                    <div class="row" style="height: 30px">
                        <p class="col-sm-1 px-0" style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 4px;font-size: 12px">3</p>
                        <div class="progress col-sm-9 p-0" style="margin-top: 6px;height: 10px">
                            <div class="progress-bar" style="width: ${(noOfEachRating[3] * 100) / miniCourse.noOfRatings}%;">
                                
                            </div>
                        </div>
                        <p class="col-sm-1 px-0 " style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 10px;font-size: 12px">${noOfEachRating[3]}</p>
                    </div>
                    <div class="row" style="height: 30px">
                        <p class="col-sm-1 px-0" style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 4px;font-size: 12px">2</p>
                        <div class="progress col-sm-9 p-0" style="margin-top: 6px;height: 10px">
                            <div class="progress-bar" style="width: ${(noOfEachRating[2] * 100) / miniCourse.noOfRatings}%;">
                                
                            </div>
                        </div>
                        <p class="col-sm-1 px-0 " style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 10px;font-size: 12px">${noOfEachRating[2]}</p>
                    </div>
                    <div class="row" style="height: 30px">
                        <p class="col-sm-1 px-0" style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 4px;font-size: 12px">1</p>
                        <div class="progress col-sm-9 p-0" style="margin-top: 6px;height: 10px">
                            <div class="progress-bar" style="width: ${(noOfEachRating[1] * 100) / miniCourse.noOfRatings}%;">
                                
                            </div>
                        </div>
                        <p class="col-sm-1 px-0 " style="color: #999;font-weight: 500;border: none !important;padding-top:3px;margin-left: 10px;font-size: 12px">${noOfEachRating[1]}</p>
                    </div>
                    
                </div>
                
           </div>
           <br>
                 <button id="rateAndReview" class="btn btn-success text-uppercase" data-toggle="modal" data-target="#reviewModal"
                                style="background-color:#4bca81;padding: 10px 45px;color: white;font-size: 12px;font-weight: 700;cursor: pointer;width: auto;border-radius: 100px">Rate And Review</button>
             
      `



          );
        }
      }).fail(function (object) {
      if (object.responseText === 'Unauthorized') {
        const enroll = $('#enroll');
        enroll.click(function () {
          window.alert('Please Login First');
          window.location.replace('/');
          });
        }
      });

        
        enroll.click(function () {
          $('#msg').text("Already Enrolled");
        });
      } else if (enrollment.isEnrolled === 'false') {
        const $lowerRating = $('#lower-rating');
          $lowerRating.append(`
          <p> You have to first enroll to give a review. </p>
        `)
        enroll.click(function () {
          $.ajax({
            url: "/api/minicourses/" + miniCourseId + "/enroll",
            method: 'POST',
            headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
          }).done(function (data) {
            console.log("enrol fn");
            console.log(data.success);
            if (data.success === 'true') {
              enroll.text("Enrolled");
              enroll.unbind('click');
              isEnrolled = true;
              $('#msg').text("");
              enroll.click(function () {
                $('#msg').attr('class', 'text-success').text("Already Enrolled");
                console.log(data.success);

              });
            } else {

              if (data.message === "Student Only")
                $('#msg').attr('class', 'text-danger').text("Only Students Can Enroll");
              else
                $('#msg').attr('class', 'text-danger').text("Enroll Again");
            }
          }).fail(function (object) {
            window.alert('Please Login First');
            window.location.replace('/');
          });
        })
      } else if (enrollment.success === 'false') {
        $('#msg').attr('class', 'text-danger').text("Enroll Again");
      }
    }).fail(function (object) {
      if (object.responseText === 'Unauthorized') {
        const enroll = $('#enroll');
        enroll.click(function () {
          window.alert('Please Login First');
          window.location.replace('/');
        });
      }
    });


    const lectures = $('#lectures');
    const materials = $('#materials');
    const reviews = $('#reviews');

    for (let i = 0; i < miniCourse.lessons.length; i++) {
      lectures.append(`<div class="col-sm-12" style="cursor: pointer;height: auto;padding: 20px;border-bottom: solid 2px #EEEEEE;"
                            onclick="goToLesson(` + miniCourse.lessons[i].id + `,'`+miniCourse.lessons[i].name+`')">
                        <div class="row" style="margin-bottom: 0px">
                            <div class="col-sm-1" style="padding-left: 0px">
                                <img src="/images/icons/movie.png">
                            </div>
                            <div class="col-sm-10">
                                <h5 style=";margin-bottom: 7px; font-size: 18px;color: #444; font-weight: 500">` + miniCourse.lessons[i].name + `<br></h5>
                                <p style="font-size: 14px;font-weight: 400;margin-bottom: 0px;color: #A4A5A9">
                                    <img src="/images/icons/timer.png" style="height: 20px">&nbsp;
                                    <span style="margin-top: 5px; font-weight: 500; font-size: 12px">` + miniCourse.lessons[i].duration + `</span>&nbsp;&nbsp;
                                    <img src="/images/thumb-up-gray.png" style="height: 20px">&nbsp;<span style="margin-top: 5px; font-weight: 500; font-size: 12px">` + miniCourse.lessons[i].upvotes + ` upvotes</span>
                                </p>
                            </div>
                            <div class="col-sm-1">
                                <img src="/images/icons/arrow-right-drop-circle-green.png">
                            </div>
                        </div>
                    </div>         
            `)
    }

$.ajax({
    url: "/api/minicourses/" + miniCourseId + "/material",
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }).done(function (mat) {
    console.log("Material api called");
    if (mat.length != 0) {
      console.log(mat);
      materials.append(`<div class="col-sm-12" style="cursor: pointer;height: auto;padding: 20px;border-bottom: solid 2px #EEEEEE;"
                            ">
                        <div class="row" style="margin-bottom: 0px">
                    
                        `);
      for(var i=0;i<mat.length;i++) {
        materials.append(`<br>
          <div class="col-sm-10">
    <h4  style=";margin-bottom: 7px; font-size: 18px;color: #444; font-weight: 500">`+ mat[i] + `</h4>
<a  style=";margin-bottom: 7px; font-size: 18px; font-weight: 500" href="/uploads/`+ miniCourseId+ `/`+ mat[i] +`" download>Download link</a><br><br>
</div>`
 );
      }

      materials.append(`</div></div>`);

    }
    else {
      materials.append("No Materials"); 
    }
  }).fail(function (object) {
    console.log("Failed");
  });

    /*
      for (let i = miniCourse.materials.length - 1; i >= 0; i--) {
      if (!miniCourse.materials[i].description) {
        continue;
      }
      reviews.append(`<div class="col-sm-12" style="height: auto;padding: 20px;border-bottom: solid 2px #EEEEEE;">
                        <div class="row" style="margin-bottom: 0px">
                            <div class="col-sm-1" style="padding-left: 0px">
                                <img src="/images/user-image.jpg" style="border-radius: 50%; height: 50px">
                            </div>
                            <div class="col-sm-11">
                                <div id="jRate-${miniCourse.reviews[i].id}">
                                </div>
                            </div>
                            <div class="col-sm-12" style="margin-top: 15px">
                                <p style="font-size: 14px;font-weight: 400;margin-bottom: 0px;color: #A4A5A9">
                                    ${miniCourse.materials[i].description}
                                </p>
                            </div>
                        </div>
                    </div>         
            `);
    }
    */
    let defaultName = 'Anonymous User'
    for (let i = miniCourse.reviews.length - 1; i >= 0; i--) {
      if (!miniCourse.reviews[i].description) {
        continue;
      }
      reviews.append(`<div class="col-sm-12" style="height: auto;padding: 20px;border-bottom: solid 2px #EEEEEE;">
                        <div class="row" style="margin-bottom: 0px">
                            <div class="col-sm-1" style="padding-left: 0px">
                                <img src="/images/user-image.jpg" style="border-radius: 50%; height: 50px">
                            </div>
                            <div class="col-sm-11">
                                <h6 style=";margin-bottom: 7px; color: #444; font-weight: 500;padding-top: 5px"><b>${(miniCourse.reviews[i].student ? miniCourse.reviews[i].student.name : defaultName)}</b><br></h6>
                                <div id="jRate-${miniCourse.reviews[i].id}">
                                </div>
                                
                            </div>
                            <div class="col-sm-12" style="margin-top: 15px">
                                <p style="font-size: 14px;font-weight: 400;margin-bottom: 0px;color: #A4A5A9">
                                    ${miniCourse.reviews[i].description}
                                </p>
                            </div>
                        </div>
                    </div>         
            `);
      $(`#jRate-${miniCourse.reviews[i].id}`).jRate({
        rating: +miniCourse.reviews[i].rating,
        startColor: '#FFD700',
        endColor: '#FFD700',
        height: 15,
        readOnly: true
      });
    }

    if (reviews.children().length === 0) {
      reviews.append(`
        <p class="col-sm-12 m-0" style="color: #999;font-weight: 500;border: none !important;padding:10px;font-size: 20px">No Reviews</p>
        `)
    }

  });
});

function goToLesson(lessonId, lessonName) {
  console.log("reached")
  if (isEnrolled) {
    console.log(lessonName);
    let name =  lessonName.split(" ").join("-");
    console.log(name)
    window.location = '/lessons/' + lessonId + '/' + name;
  } else {
    $('#msg').text("Please Enroll First");
  }
}
