"use strict"

window.addEventListener("DOMContentLoaded", start);

/* ---------------------------------------GLOBAL-------------------------------------------------------------- */

let allStudents = [];
let prefects = [];
let newPrefects = [];
let expelledList = [];
let notExpelled = [];

let onlyGry;
//Protoype for Hacked student:
let hackedOne = {
    firstName: "Luciano",
    middleName: "Kring Brandt",
    lastName: "Souza",
    newName: "Luciano de Souza",
    nickName: "",
    gender: "boy",
    houseName: "Gryffindor",
    house: "Gryffindor",
    image: "",
    star: false,

}
//Prototype for all students: 
const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    newName: "",
    nickName: "",
    gender: "",
    houseName: "",
    image: "",
    star: false,
    expelled: false
};

/* ---------------------------------------INIT-------------------------------------------------------------- */
//Event Listeners:
function start() {
    console.log("starting")
    loadJSON();
    // filters
    document.querySelector("[data-filter='Gryffindor']").addEventListener("click", filterGry);
    document.querySelector("[data-filter='Slytherin']").addEventListener("click", filterSly);
    document.querySelector("[data-filter='Hufflepuff']").addEventListener("click", filterHuf);
    document.querySelector("[data-filter='Ravenclaw']").addEventListener("click", filterRav);
    document.querySelector("[data-filter='*']").addEventListener("click", filterAll);
    //Sorting
    document.querySelector("[data-sort='firstN']").addEventListener("click", sortFirst);
    document.querySelector("[data-sort='lastN']").addEventListener("click", sortLast);
    document.querySelector("[data-sort='houseN']").addEventListener("click", sortHouse);
    //Expelled
    document.querySelector(".showExpelledStudents").addEventListener("click", showExpelledStudents);
    document.querySelector(".restore").addEventListener("click", restoreExpelled);
    //Hack the System
    document.querySelector(".hackTheStudentList").addEventListener("click", hackTheStudentList);
}

async function loadJSON() {
    const response = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const jsonData = await response.json();
    //when loaded, prepare data objects:
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    allStudents = jsonData.map(prepareObject);
    displayList(allStudents);
}

/* ---------------------------------------CAPITALIZE, ORGANIZE FULL NAME-------------------------------------------------------------- */

function prepareObject(jsonObject) {
    const student = Object.create(Student);
    const parts = jsonObject.fullname.trim();
    const houseParts = jsonObject.house.trim();
    //console.log(jsonObject.fullname.split(" "))
    student.house = (houseParts.substring(0, 1)).toUpperCase() + (houseParts.substring(1, )).toLowerCase();
    student.gender = jsonObject.gender;
    //console.log(parts)
    //console.log(parts.split(" "))
    //console.log(student.firstName = texts[1])
    let texts = parts.split(" ")
    //console.log(texts[0].substring(0,1))
    if (texts.length < 3) {
        // console.log("its 2 names")
        if (texts[0]) {
            student.firstName = texts[0].substring(0, 1).toUpperCase() + texts[0].substring(1, ).toLowerCase();
        }
        if (texts[1]) {
            student.lastName = texts[1].substring(0, 1).toUpperCase() + texts[1].substring(1, ).toLowerCase();
        }
        student.newName = `${student.firstName} ${student.lastName}`
    } else {
        // console.log("its 3 names")
        if (texts[0]) {
            student.firstName = texts[0].substring(0, 1).toUpperCase() + texts[0].substring(1, ).toLowerCase()
        }
        if (texts[1]) {
            student.middleName = texts[1].substring(0, 1).toUpperCase() + texts[1].substring(1, ).toLowerCase()
        }
        if (texts[2]) {
            student.lastName = texts[2].substring(0, 1).toUpperCase() + texts[2].substring(1, ).toLowerCase()
        }
        student.newName = `${student.firstName} ${student.middleName} ${student.lastName}`
    }
    return student;
}

/* ---------------------------------------FILTERS------------------------------------------------------------------------------------- */

function filterGry() {
    let onlyGry = allStudents.filter(displayGry);
    displayList(onlyGry)
    //filter counter
    document.querySelector(".gryfNum").textContent = `Gryffindor (${onlyGry.length})`;

    function displayGry(student) {
        return student.house === "Gryffindor";
    }
    console.log(onlyGry)
}

function filterSly() {
    let onlySly = allStudents.filter(displaySly);
    displayList(onlySly)
    //filter counter
    document.querySelector(".slyNum").textContent = `Slytherin (${onlySly.length})`;

    function displaySly(student) {
        return student.house === "Slytherin";
    }
}

function filterHuf() {
    let onlyHuf = allStudents.filter(displayHuf);
    displayList(onlyHuf)
    //filter counter
    document.querySelector(".huffNum").textContent = `Hufflepuff (${onlyHuf.length})`;

    function displayHuf(student) {
        return student.house === "Hufflepuff";
    }
}

function filterRav() {
    let onlyRav = allStudents.filter(displayRav);
    displayList(onlyRav)
    //filter counter
    document.querySelector(".ravNum").textContent = `Ravenclaw (${onlyRav.length})`;

    function displayRav(student) {
        return student.house === "Ravenclaw";
    }
}

function filterAll() {
    displayList(allStudents)
    //filter counter
    document.querySelector(".totalNum").textContent = `Total (${allStudents.length})`;
}

/* ---------------------------------------------LISTS------------------------------------------------------------------------------- */

function displayList(students) {
    // clear the list
    document.querySelector("#studentsMain").innerHTML = "";
    // build a new list
    students.forEach(displayStudent);
    //console.log(allStudents)
    closeModal();
}

/* ---------------------------------------------TEMPLATE------------------------------------------------------------------------------- */

function displayStudent(student) {
    //console.log(student);
    //Select a Theme:
    document.querySelector("select#theme").addEventListener("change", selectTheme);
    //Clone template
    const template = document.querySelector(".mainTemplate").content;
    const studentCopy = template.cloneNode(true);
    //star
    studentCopy.querySelector("[data-field=star").dataset.star = student.star;
    //star ⭐ or ☆
    if (student.star === true) {
        studentCopy.querySelector("[data-field=star]").textContent = "⭐";
    } else {
        studentCopy.querySelector("[data-field=star]").textContent = "☆";
    }
    //Click on star (prefect):
    studentCopy.querySelector("[data-field=star]").addEventListener("click", function () {
        //maxTwo(student);
        differentType(student);
    })
    //Expel a student:

    document.querySelector(".expelCount").textContent = `(${expelledList.length})`;
    studentCopy.querySelector(".expell").addEventListener("click", function () {
        expelStudent(student);
    })
    //Overview: 
    studentCopy.querySelector(".studentsFull").textContent = student.newName;
    studentCopy.querySelector(".houseName").textContent = student.house;
    studentCopy.querySelector(".studentPic").src = `pictures/${student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png"}`;
    //------- fix pictures
    if (student.firstName == "Padma") {
        studentCopy.querySelector(".studentPic").src = "pictures/" + student.lastName.toLowerCase() + "_" + "padme" + ".png";
    } else if (student.lastName == "Patil") {
        studentCopy.querySelector(".studentPic").src = "pictures/" + student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
    } else if (student.firstName == "Leanne") {
        studentCopy.querySelector(".studentPic").src = "pictures/" + "li_s" + ".png";
    } else if (student.lastName == "Finch-fletchley") {
        studentCopy.querySelector(".studentPic").src = "pictures/" + "fletchley" + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
    } else {
        studentCopy.querySelector(".studentPic").src = "pictures/" + student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png";
    }

    //-------------------MODAL--------------------
    studentCopy.querySelector("button").addEventListener("click", function () {
        const modalOpen = document.querySelector(".modal-background");
        //document.querySelector("body").setAttribute("houseStyle", this.value);
        modalOpen.classList.remove("hide");
        //before: const houseName = document.querySelector(".modal-house");
        document.querySelector(".modal-content").setAttribute("data-house", student.house);
        document.querySelector(".modalStudentsName").textContent = `First name: ${student.firstName}`;
        document.querySelector(".modalStudentsMiddle").textContent = `Middle name: ${student.middleName}`;
        document.querySelector(".modalStudentsLast").textContent = `Last name: ${student.lastName}`;
        document.querySelector(".modalPic").src = `pictures/${student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png"}`;
        document.querySelector(".modalHouses").src = `Houses/${student.house.substring(0,1).toLowerCase() + student.house.substring(1,  ).toLowerCase() + ".png"}`;
        //document.querySelector("#image school_Prefect").src = `school_prefect/${"school_prefect_"+ student.house + ".png"}`;
        //------- fix pictures modal
        if (student.firstName == "Padma") {
            document.querySelector(".modalPic").src = "pictures/" + student.lastName.toLowerCase() + "_" + "padme" + ".png";
        } else if (student.lastName == "Patil") {
            document.querySelector(".modalPic").src = "pictures/" + student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
        } else if (student.firstName == "Leanne") {
            document.querySelector(".modalPic").src = "pictures/" + "li_s" + ".png";
        } else if (student.lastName == "Finch-fletchley") {
            document.querySelector(".modalPic").src = "pictures/" + "fletchley" + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
        } else {
            document.querySelector(".modalPic").src = "pictures/" + student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png";
        }

        console.log(student.star)
        //show PREFECT or not in modal:
        //const prefectSymbol = document.querySelector("#imagePrefect");
        if (student.star == true) {
            document.querySelector(".modalSchool_Prefect").textContent = `school_Prefect: Yes`;
            // prefectSymbol.classList.add("true");
        } else {
            document.querySelector(".modalSchool_Prefect").textContent = `school_Prefect: no`;
            // school_prefectSymbol.classList.remove("true");
        }
        //show EXPELLED or not in modal:
        if (student.expelled == true) {
            document.querySelector(".modalExpelled").textContent = `Expelled: Yes`;
        } else {
            document.querySelector(".modalExpelled").textContent = `Expelled: no`;
        }
        //Expelled for the hacked:
        if (student.newName == "Luciano de Souza") {
            document.querySelector(".modalExpelled").textContent = `Expelled: never`;
        }
    });

    //3.append
    document.querySelector("#studentsMain").appendChild(studentCopy);
    //console.log(student)
}

/* ---------------------------------------SORTING------------------------------------------------------------------------------------- */
//sort by FIRST name
function sortFirst() {
    if (event.target.dataset.sortDirection === "asc") {
        event.target.dataset.sortDirection = "desc";
        console.log("sort asc")
        firstAsc();
    } else {
        console.log("sort desc")
        firstDesc();
        event.target.dataset.sortDirection = "asc";
    }
}
//condition - ascending
function firstAsc() {
    console.log(allStudents)

    function compareName(a, b) {
        if (a.firstName < b.firstName) {
            return -1;
        } else if (a.firstName > b.firstName) {
            return 1;
        }
    }
    allStudents.sort(compareName)
    displayList(allStudents)
}
//condition - descending
function firstDesc() {
    console.log(allStudents)

    function compareName(a, b) {
        if (a.firstName < b.firstName) {
            return 1;
        } else if (a.firstName > b.firstName) {
            return -1;
        }
    }
    allStudents.sort(compareName)
    displayList(allStudents)
}

//sort by LAST NAME
function sortLast() {
    if (event.target.dataset.sortDirection === "asc") {
        event.target.dataset.sortDirection = "desc";
        console.log("sort asc")
        lastAsc();
    } else {
        console.log("sort desc")
        lastDesc();
        event.target.dataset.sortDirection = "asc";
    }
}
//condition - ascending
function lastAsc() {
    console.log(allStudents)

    function compareName(a, b) {
        if (a.lastName < b.lastName) {
            return -1;
        } else if (a.lastName > b.lastName) {
            return 1;
        }
    }
    allStudents.sort(compareName)
    displayList(allStudents)
}
//condition - descending
function lastDesc() {
    console.log(allStudents)

    function compareName(a, b) {
        if (a.lastName < b.lastName) {
            return 1;
        } else if (a.lastName > b.lastName) {
            return -1;
        }
    }
    allStudents.sort(compareName)
    displayList(allStudents)
}

//sort by HOUSE name
function sortHouse() {
    if (event.target.dataset.sortDirection === "asc") {
        event.target.dataset.sortDirection = "desc";
        console.log("sort asc")
        houseAsc();
    } else {
        console.log("sort desc")
        houseDesc();
        event.target.dataset.sortDirection = "asc";
    }
}
//condition - ascending
function houseAsc() {
    //console.log(houseParts)
    function compareName(a, b) {
        if (a.house < b.house) {
            return -1;
        } else if (a.house > b.house) {
            return 1;
        }
    }
    allStudents.sort(compareName)
    displayList(allStudents)
}
//condition - descending
function houseDesc() {
    console.log(allStudents)

    function compareName(a, b) {
        if (a.house < b.house) {
            return 1;
        } else if (a.house > b.house) {
            return -1;
        }
    }
    allStudents.sort(compareName)
    displayList(allStudents)
}

/* -----------------------------------------------------------------------School_PREFECTS----------------------------------------------------------------------------------- */

function differentType(student) {
    if (student.star) {
        //console.log("this student is NOT a favorite")
        student.star = false;
        console.log(student.star)
    } else {
        //student.star = true 
        console.log(student.star)
        //console.log("this student IS a favorite")
        function checkType(x) {
            return x.gender === student.gender;
        }
        //define who will be in the new School_Prefects array:
        school_prefects = allStudents.filter(students => students.star == true);
        if (prefects.some(checkType) == false) {
            student.star = true;
            console.log(student.star)
        } else {
            console.log(school_prefects[0])
            console.log(school_prefects)
            console.log(student.star)
            document.querySelector("#onlyoneofeachgender").classList.add("show")
            //find the one that has the same type:
            console.log(school_prefects[0].firstName)
            document.querySelector("#onlyoneofeachgender .student1").textContent = `${school_prefects[0].newName} (${school_prefects[0].gender})`;
            document.querySelector("#onlyoneofeachgender [data-action=remove1]").addEventListener("click", function () {
                console.log(school_prefects[0])
                //give the value False to the duplicate that has to be removed:
                school_prefects[0].star = false;
                student.star = true;
                //immediately close dialog:
                document.querySelector("#onlyoneofeachgender").classList.remove("show")
                displayList(allStudents);
            })
            //option close dialog:   
            document.querySelector("#onlyoneofeachgender .closebutton").addEventListener("click", function () {
                document.querySelector("#onlyoneofeachgender").classList.remove("show")
            })
            displayList(allStudents);
        }

        //user cannot select more than 2:
        if (school_prefects.length > 2) {
            document.querySelector("#onlytwoschool_prefects").classList.add("show");
            console.log(school_prefects)
            console.log(student.star)
            document.querySelector("#onlytwoschool_prefects .student1").textContent = `${school_prefects[0].newName} (${school_prefects[0].gender})`;
            document.querySelector("#onlytwoschool_prefects [data-action=remove1]").addEventListener("click", function () {
                console.log(school_prefects[0])
                //sets to false the student to be removed:
                school_prefects[0].star = false;
                //winners[1].star = true;
                //selects the student user is clicking now:
                student.star = true;
                displayList(allStudents)
                document.querySelector("#onlytwoschool_prefects").classList.remove("show")
            })
            //second button:
            document.querySelector("#onlytwoschool_prefects .student2").textContent = `${school_prefects[1].newName} (${school_prefects[1].gender})`;
            document.querySelector("#onlytwoschool_prefects [data-action=remove2]").addEventListener("click", function () {
                console.log(school_prefects[1])
                school_prefects[1].star = false;
                // winners[0].star = true;
                student.star = true;
                displayList(allStudents)
                document.querySelector("#onlytwoschool_prefects").classList.remove("show")
            })
        }
        school_prefects = allStudents.filter(students => students.star == true);
        console.log(allStudents.filter(school_prefects => school_prefects.star == true));

    }
    displayList(allStudents)

}

/* -----------------------------------------------------------------------EXPELLED----------------------------------------------------------------------------------- */

function expelStudent(student) {
    student.expelled = true;
    expelledList.push(student);
    console.log(allStudents.filter(student => student.expelled === false))
    allStudents = allStudents.filter(student => student.expelled === false)
    document.querySelector(".expelCount").textContent = `(${expelledList.length})`;
    //prevent user from expelling the Hacked one:
    if (student.newName == "Luciano de Souza") {
        console.log("thats me!")
        student.expelled = false;
        expelledList.pop(hackedOne);
        allStudents.unshift(hackedOne);
        alert("Try as much as you can!")
    }
    displayList(allStudents)
    console.log(expelledList)
}

function showExpelledStudents() {
    console.log(expelledList)
    console.log(allStudents)
    displayList(expelledList)
}

function restoreExpelled() {
    allStudents = expelledList.concat(allStudents)
    console.log(allStudents)
    displayList(allStudents)
}

/* ---------------------------------------------HACK THE SYSTEM------------------------------------------------------------------------------- */

function hackTheStudentList() {
    console.log(allStudents)
    console.log(hackedOne)
    //allStudents = allStudents.push(hackedOne);
    allStudents.unshift(hackedOne);
    console.log(allStudents)
    displayList(allStudents)
}

/* ---------------------------------------------OTHERS------------------------------------------------------------------------------- */

function closeModal() {
    const modal = document.querySelector(".modal-background");
    modal.addEventListener("click", () => {
        modal.classList.add("hide");
    });
}

function selectTheme() {
    document.querySelector("body").setAttribute("homeStyle", this.value);
    console.log(selectTheme)
}


/* ---------------------------------------------TYPEWRITER------------------------------------------------------------------------------- */


const element = document.querySelector(".hackTheStudentList");
typewriter(element, done);

function done() {
    //console.log("Done")
}

function typewriter(element, callback) {
    let sentence = document.querySelector(".hackTheStudentList").textContent;
    //console.log(sentence)
    let counter = 0;
    //console.log(counter)
    let getLetter = sentence[0];
    //console.log(getLetter)
    displayAll();

    function displayAll() {
        //show 1st letter, 2nd, 3rd....
        //console.log(sentence.substring(0, counter+1))
        //console.log(sentence.substring(0, counter+2))
        //console.log(sentence.substring(0, counter+3))
        let oneEach = sentence.substring(0, counter + 1);
        //console.log(oneEach)
        //hide the text first
        element.textContent = "";
        element.textContent = oneEach;
        ++counter;
        if (sentence.length > counter) {
            setTimeout(displayAll, 150)
        } else {
            callback();
        }
    }
}