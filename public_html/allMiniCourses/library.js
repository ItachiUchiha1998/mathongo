/**
 * Created by apoorvaa_gupta on 13/6/17.
 */
// a.toLowerCase().split(" ").join("-")

$('document').ready(function () {


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
            $('#header-bar').append(`<div class=" col-sm-2 col-12 align-middle header-links-div"><a class="align-middle header-links" href="/">Register / Login</a></div>`)
        }
    });



    $.get("/api/minicourses", addMiniCourses);

    $.get("/api/extra/filters", function (filters) {

        const allFilter = $('#allFilters');
        if (filters.categoryObject && filters.categoryObject.length > 1) {
            let categoryString = `<div class="filter-column-divs">
                    <div class="filter-column-divs-heading"><b>CATEGORY</b></div>
                    <div class="filter-column-divs-content">`;
            for (let i = 0; i < filters.categoryObject.length; i++) {
                categoryString += `
                        <label class="label-style">
                            <input class="checkbox-style" name="category" value="` + filters.categoryObject[i].id + `" type="checkbox">` + filters.categoryObject[i].categoryName + `<br/>
                        </label>
                        <br>
                    `;
            }
            categoryString += `</div></div>`;
            allFilter.append(categoryString);

        }
        if (filters.subjectObject && filters.subjectObject.length > 1) {
            let subjectString = `<div class="filter-column-divs">
                    <div class="filter-column-divs-heading"><b>SUBJECT</b></div>
                    <div class="filter-column-divs-content">`;
            for (let i = 0; i < filters.subjectObject.length; i++) {
                subjectString += `
                        <label class="label-style">
                            <input class="checkbox-style" name="subject" value="` + filters.subjectObject[i].id + `" type="checkbox">` + filters.subjectObject[i].subjectName + `<br/>
                        </label>
                        <br>
                    `;
            }
            subjectString += `</div></div>`;
            allFilter.append(subjectString);

        }
        if (filters.classObject && filters.classObject.length > 1) {
            let classString = `<div class="filter-column-divs">
                    <div class="filter-column-divs-heading"><b>CLASS</b></div>
                    <div class="filter-column-divs-content">`;
            for (let i = 0; i < filters.classObject.length; i++) {
                classString += `
                        <label class="label-style">
                            <input class="checkbox-style" name="class" value="` + filters.classObject[i].id + `" type="checkbox">` + filters.classObject[i].className + `<br/>
                        </label>
                        <br>
                    `;
            }
            classString += `</div></div>`;
            allFilter.append(classString);

        }
        allFilter.append(`<div class="filter-column-divs">
                    <div class="filter-column-divs-heading"><b>DIFFICULTY</b></div>
                    <div class="filter-column-divs-content">
                        <label class="label-style">
                            <input class="checkbox-style" name="difficulty" value="Beginner" type="checkbox">Beginner<br/>
                        </label>
                        <br>
                        <label class="label-style">
                            <input class="checkbox-style" name="difficulty" value="Intermediate" type="checkbox">Intermediate<br>
                        </label>
                        <br>
                        <label class="label-style">
                            <input class="checkbox-style" name="difficulty" value="Advance" type="checkbox">Advance<br>
                        </label>
                    </div>
                </div>
                <div class="filter-column-divs">
                    <div class="filter-column-divs-heading"><b>MEDIUM</b></div>
                    <div class="filter-column-divs-content">
                        <label class="label-style">
                            <input class="checkbox-style" name="medium" value="English" type="checkbox">English<br/>
                        </label>
                        <br>
                        <label class="label-style">
                            <input class="checkbox-style" name="medium" value="Hindi" type="checkbox">Hindi<br>
                        </label>

                    </div>
                </div>`);

        $('input[type="checkbox"]').change(function () {
            let categoryArray = [];
            let subjectArray = [];
            let classArray = [];
            let difficultyArray = [];
            let mediumArray = [];
            let count = 0;

            const filterTabs = $('#filterTabs');
            filterTabs.text("");
            const categoryFilters = $('input[name="category"]');
            const subjectFilters = $('input[name="subject"]');
            const classFilters = $('input[name="class"]');
            const difficultyFilters = $('input[name="difficulty"]');
            const mediumFilters = $('input[name="medium"]');

            for (let i = 0; i < categoryFilters.length; i++) {
                if (categoryFilters[i].checked) {
                    categoryArray.push(categoryFilters[i].value);
                    count++;
                    filterTabs.append(`<li class="filter-bar-ul-li"><span class="filter-bar-ul-li-filter">` + categoryFilters[i].parentElement.innerText + `</span>
                        </li>`)
                }
            }

            for (let i = 0; i < subjectFilters.length; i++) {
                if (subjectFilters[i].checked) {
                    subjectArray.push(subjectFilters[i].value);
                    count++;
                    filterTabs.append(`<li class="filter-bar-ul-li"><span class="filter-bar-ul-li-filter">` + subjectFilters[i].parentElement.innerText + `</span>
                        </li>`)
                }
            }

            for (let i = 0; i < classFilters.length; i++) {
                if (classFilters[i].checked) {
                    classArray.push(classFilters[i].value);
                    count++;
                    filterTabs.append(`<li class="filter-bar-ul-li"><span class="filter-bar-ul-li-filter">` + classFilters[i].parentElement.innerText + `</span>
                        </li>`)
                }
            }

            for (let i = 0; i < difficultyFilters.length; i++) {
                if (difficultyFilters[i].checked) {
                    difficultyArray.push(difficultyFilters[i].value);
                    count++;
                    filterTabs.append(`<li class="filter-bar-ul-li"><span class="filter-bar-ul-li-filter">` + difficultyFilters[i].parentElement.innerText + `</span>
                        </li>`)
                }
            }

            for (let i = 0; i < mediumFilters.length; i++) {
                if (mediumFilters[i].checked) {
                    mediumArray.push(mediumFilters[i].value);
                    count++;
                    filterTabs.append(`<li class="filter-bar-ul-li"><span class="filter-bar-ul-li-filter">` + mediumFilters[i].parentElement.innerText + `</span>
                        </li>`)
                }
            }

            const filter = {
                classObject: classArray,
                subjectObject: subjectArray,
                categoryObject: categoryArray,
                difficultyObject: difficultyArray,
                mediumObject: mediumArray
            };
            if (count === 0) {
                $.get("/api/minicourses", addMiniCourses);

            } else {
                $.post("/api/minicourses/withFilters", {
                    filter: filter
                }, addMiniCourses);
            }
        });

    });

})
;

function addMiniCourses(minicourses) {
    console.log(minicourses);
    const ul = $('#minicourses-list');
    ul.empty();
    for (let i = 0; i < minicourses.length; i++) {
        let name = minicourses[i].name.split(" ").join("-");
        let category = (minicourses[i].minicoursecategories[0].category.categoryName);
        let categories = minicourses[i].minicoursecategories.map((i) => i.category.categoryName).join(', ');
        ul.append('<li> <div class="minicourses-list-li"> <div class="row minicourse-div"> <div class="col-sm-4" style="padding: 0"><img src="./../images/'+ category+ '/' + minicourses[i].tag.course.courseName.toLowerCase().split(" ").join("-") + '.png" class="minicourse-img"></div>' +
            '<div class="col-sm-8 minicourse-content">' +
            '<div class="row minicourse-chps"><span>' + minicourses[i].tag.subject.subjectName + '</span>&nbsp;&nbsp; >&nbsp;&nbsp;<span>' + minicourses[i].tag.course.courseName + '</span></div>' +
            '<div class="row minicourse-title"><span>' + minicourses[i].name + '</span></div>' +
            '<div class="row"><p class="minicourse-description">' + minicourses[i].description + '</p></div>' +
            '<div class="row align-items-center"><a href="/courses/' + minicourses[i].id + '/'+name+'" class="enrol-style">VIEW</a></div>' +
            '</div> </div> <div class="row minicourse-tags"> <div class="minicourse-tag">' +
            '<div class="row tag-title">TEACHER </div> <div class="row tag-content">' +
            '<img src="../images/'+minicourses[i].tutor.img+'.jpg" style="border-radius: 50%; height: 30px">&nbsp;&nbsp;' +
            '<span class="align-middle" style="margin-top: 5px"> ' + minicourses[i].tutor.name + '</span></div> </div>' +
            '<div class="minicourse-tag"> <div class="row tag-title">DURATION</div>' +
            '<div class="row tag-content"><span>' + minicourses[i].duration + '</span></div> </div> <div class="minicourse-tag">' +
            '<div class="row tag-title">DIFFICULTY</div> <div class="row tag-content"><span>' + minicourses[i].level + '</span></div>' +
            '</div> <div class="minicourse-tag"> <div class="row tag-title">RELEVANCE</div>' +
            '<div class="row tag-content"><span>' + categories + '</span></div> </div> <div class="minicourse-tag">' +
            '<div class="row tag-title">MEDIUM</div>' +
            '<div class="row tag-content"><span>' + minicourses[i].medium + '</span></div> </div> </div> </div> </li>'
        )
    }
}