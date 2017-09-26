/**
 * Created by apoorvaa_gupta on 2/6/17.
 */

$('document').ready(function () {
    $('#name').text(localStorage.getItem('name'));
    const studentId = window.location.pathname.split('/student/')[1].split('/')[0];

    $.ajax({
        url: "/api/students/mycourses",
        method: 'GET',
        headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
    }).done(function (enrollments) {
        console.log(enrollments);
        const ul = $('#minicourses-list');
        for (let i = 0; i < enrollments.length; i++) {
            let name = enrollments[i].minicourse.name.split(" ").join("-");
            let category = enrollments[i].minicourse.minicoursecategories[0].category.categoryName;
            console.log(category);
            let categories = enrollments[i].minicourse.minicoursecategories.map((i) => i.category.categoryName).join(', ');
            ul.append('<li> <div class="minicourses-list-li"> <div class="row minicourse-div"> <div class="col-sm-4" style="padding: 0"><img src="./../../images/'+ category+ '/' + enrollments[i].minicourse.tag.course.courseName.toLowerCase().split(" ").join("-") + '.png" class="minicourse-img"></div>' +
                '<div class="col-sm-8 minicourse-content">' +
                '<div class="row minicourse-chps"><span>' + enrollments[i].minicourse.tag.subject.subjectName + '</span>&nbsp;&nbsp; >&nbsp;&nbsp;<span>' + enrollments[i].minicourse.tag.course.courseName + '</span></div>' +
                '<div class="row minicourse-title"><span>' + enrollments[i].minicourse.name + '</span></div>' +
                '<div class="row"><p class="minicourse-description">' + enrollments[i].minicourse.description + '</p></div>' +
                '<div class="row align-items-center"><a href="/courses/' + enrollments[i].minicourse.id + "/" + name + '" class="enrol-style">VIEW</a></div>' +
                '</div> </div> <div class="row minicourse-tags"> <div class="minicourse-tag">' +
                '<div class="row tag-title">TEACHER </div> <div class="row tag-content"><span>' + enrollments[i].minicourse.tutor.name + '</span></div> </div>' +
                '<div class="minicourse-tag"> <div class="row tag-title">DURATION</div>' +
                '<div class="row tag-content"><span>' + enrollments[i].minicourse.duration + '</span></div> </div> <div class="minicourse-tag">' +
                '<div class="row tag-title">DIFFICULTY</div> <div class="row tag-content"><span>' + enrollments[i].minicourse.level + '</span></div>' +
                '</div> <div class="minicourse-tag"> <div class="row tag-title">RELEVANCE</div>' +
                '<div class="row tag-content"><span>' + categories + '</span></div> </div> <div class="minicourse-tag">' +
                '<div class="row tag-title">MEDIUM</div>' +
                '<div class="row tag-content"><span>' + enrollments[i].minicourse.medium + '</span></div> </div> </div> </div> </li>'
            )
        }
    }).fail(function (object) {
        if (object.responseText === 'Unauthorized') {
            window.alert("Please Login First");
            window.location.replace('/');
        }
    });


});