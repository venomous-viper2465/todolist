import "./stylehome.css";
import {
  addTaskButton,
  priorityToInt,
  tasks,
  getTaskDetails,
  addTaskToProject,
  importanceToString,
  addTaskToDom,
  pageHeading,
  loadProject,
} from "./home";
import { loadMainPage, loadProjectPage } from "./pageloader";
const { isSameDay } = require("date-fns");
const { differenceInDays } = require("date-fns");

export let projectList = [];
let pid = 0;
function pidGenerator() {
  return pid++;
}
import browncalendar from "./images/calendarbrown.svg";
import brownclock from "./images/clockbrown.svg";
import browninbox from "./images/inboxbrown.svg";

//structure of a project object
export function createProject(projectName, color) {
  let pId = pidGenerator();
  let getName = projectName;
  let getColor = color;
  let tasks = [];
  let completedTasks = [];

  let addTask = function (task) {
    tasks.push(task);
  };
  let numtasks = function () {
    return tasks.length;
  };
  return {
    addTask,
    numtasks,
    getColor,
    getName,
    pId,
    tasks,
    completedTasks,
  };
}

//create task form will have option to select this project
function addToCreateTaskDropDown(project) {
  const select = document.querySelector("#addtaskform select");
  const option = document.createElement("option");
  option.setAttribute("value", `${project.pId}`);
  option.textContent = project.getName;
  select.appendChild(option);
}

//to add a new project to the sidebar when it is created.
export function projectToSidebar(projectName, pcolor, numTasks, pId) {
  const div = document.createElement("div");
  div.setAttribute("category", "side-nav");
  div.setAttribute("project-id", `${pId}`);
  div.classList.add("sideprojects");

  //the color indicator of the project
  const colorBox = document.createElement("div");
  colorBox.style.backgroundColor = `${pcolor}`;
  colorBox.classList.add("colorBox");

  const text = document.createElement("p");
  text.textContent = `${projectName}`;

  const numBox = document.createElement("div");
  numBox.classList.add("numtasks");
  const number = document.createElement("p");
  number.textContent = `${numTasks}`;
  numBox.appendChild(number);

  div.appendChild(colorBox);
  div.appendChild(text);
  div.appendChild(numBox);
  const mainBox = document.querySelector(".projectoptions");
  mainBox.appendChild(div);

  //loading the project page when clicked
  buttonToLoadPage(div);
}

//adding event listeners to inbox, upcoming, today side nav buttons;
const sideNavButtons = document.querySelectorAll('[category="side-nav"]');
sideNavButtons.forEach((button) => {
  buttonToLoadPage(button);
});

function buttonToLoadPage(div) {
  // category="side-nav"
  div.addEventListener("click", (event) => {
    let targetButton = event.target.closest('[category="side-nav"]');
    let navButtons = document.querySelectorAll('[category="side-nav"]');
    removePage();
    // console.log(targetButton);
    //remove the active nav button
    navButtons.forEach((button) => {
      if (button.classList.contains("active-nav")) {
        const activeNavIcon = button.querySelector("img");
        if (button.classList.contains("inbox")) {
          activeNavIcon.src = browninbox;
        } else if (button.classList.contains("upcoming")) {
          activeNavIcon.src = browncalendar;
        } else if (button.classList.contains("today")) {
          activeNavIcon.src = brownclock;
        }
        button.classList.remove("active-nav");
      }
    });

    targetButton.classList.add("active-nav");
    let projectId = targetButton.getAttribute("project-id");
    if (
      projectId === "inbox" ||
      projectId === "today" ||
      projectId === "upcoming"
    ) {
      loadMainPage(projectId);
    } else {
      loadProjectPage(Number(projectId));
    }
  });
}

//this does the operation of activating the create project button
(function projectAddButton() {
  const plusButton = document.querySelector(".myprojects > div > img");
  const dialog = document.querySelector("#create-project-form");
  plusButton.addEventListener("click", () => {
    dialog.showModal();
  });
})();

//this section is responsible for taking value from create project form
//create the project
//add it to sidenav
//add it to create task forms drop down list
(function creatingaProject() {
  const form = document.querySelector("#create-project-form > form");

  const projectColorOptions = document.querySelectorAll(".color-option-box");
  projectColorOptions.forEach((color) => {
    color.addEventListener("click", (event) => {
      let currentColor = document.querySelector(".active-color-picked");
      currentColor.classList.remove("active-color-picked");
      event.target.classList.add("active-color-picked");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let projectName = document.querySelector(
      "#create-project-form  input"
    ).value;
    let projectColor = document
      .querySelector(".active-color-picked")
      .getAttribute("p-color");
    let obj = createProject(projectName, projectColor);
    localStorage.setItem(`${obj.pId}`, JSON.stringify(obj));
    projectList.push(obj);
    projectToSidebar(obj.getName, obj.getColor, obj.numtasks(), obj.pId);
    addToCreateTaskDropDown(obj);

    projectName = "";
    projectColor = document.querySelector(".active-color-picked");
    projectColor.classList.remove("active-color-picked");
    const defaultColor = document
      .querySelector('[p-color="#d62828"]')
      .classList.add("active-color-picked");
    let dialog = document.querySelector("#create-project-form");
    dialog.close();
  });
})();

export function updateSidebarCount(sideTab, count) {
  let para = sideTab.querySelector(".numtasks > p");
  console.log(para);
  para.textContent = `${count}`;
}

export function removePage() {
  let content = document.querySelector("#content > div");
  content.remove();
}

(function closeCreateProjectForm() {
  const closeButton = document.querySelector(
    "#create-project-form > form > img"
  );
  closeButton.addEventListener("click", (event) => {
    const dialog = document.querySelector("#create-project-form");
    dialog.close();
  });
})();
