import { addTaskToDom, upcomingTasks } from "./home";
import { projectList, updateSidebarCount } from "./project";
import plusImage from "./images/plugicon.svg";
import whitecalendar from "./images/calendarwhite.svg";
import whiteclock from "./images/clockwhite.svg";
import whiteinbox from "./images/inboxwhite.svg";
const { isSameDay } = require("date-fns");
const { differenceInDays } = require("date-fns");

export function loadProjectPage(projectId) {
  let project;
  projectList.forEach((tproject) => {
    if (tproject.pId == projectId) {
      project = tproject;
    }
  });

  const parentContainer = document.querySelector("#content");
  const mainDiv = document.createElement("div");
  const headline = pageHeading(project.getName);

  mainDiv.appendChild(headline);
  parentContainer.appendChild(mainDiv);

  project.tasks.forEach((task) => {
    addTaskToDom(task);
  });
  project.completedTasks.forEach((task) => {
    addTaskToDom(task);
    const taskId = task.taskId;
    let targetDiv = document.querySelector(`[task-id="${taskId}"]`);
    targetDiv.classList.add("completed");
  });
}

export function loadMainPage(projectName) {
  const parentContainer = document.querySelector("#content");
  const mainDiv = document.createElement("div");
  const headline = pageHeading(projectName);
  mainDiv.appendChild(headline);
  parentContainer.appendChild(mainDiv);

  if (projectName === "inbox") {
    let sideIcon = document.querySelector(".inbox");
    let sIcon = sideIcon.querySelector("img");
    sIcon.src = whiteinbox;
    addTaskButton();
    let project = projectList.find((project) => project.pId === 0);
    project.tasks.forEach((task) => {
      addTaskToDom(task);
    });
    project.completedTasks.forEach((task) => {
      addTaskToDom(task);
      const taskId = task.taskId;
      let targetDiv = document.querySelector(`[task-id="${taskId}"]`);
      targetDiv.classList.add("completed");
    });
    // const sideTab = document.querySelector('[project-id="inbox"]');
    // updateSidebarCount(sideTab, project.numtasks());
    let dialogAddTask = document.querySelector(
      ".page-heading + .taskButtonStyle"
    );
    let dialog = document.querySelector("#addtaskform");
    dialogAddTask.addEventListener("click", () => {
      dialog.showModal();
    });
    return;
  } else if (projectName === "upcoming") {
    //for upcoming
    let sideIcon = document.querySelector(".upcoming");
    let sIcon = sideIcon.querySelector("img");
    sIcon.src = whitecalendar;
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        addTaskToDom(task);
      });
    });
  } else if (projectName === "today") {
    let sideIcon = document.querySelector(".today");
    let sIcon = sideIcon.querySelector("img");
    sIcon.src = whiteclock;
    projectList.forEach((project) => {
      project.tasks.forEach((task) => {
        if (isSameDay(task.dueDate, new Date())) {
          addTaskToDom(task);
        }
      });
      project.completedTasks.forEach((task) => {
        if (isSameDay(task.dueDate, new Date())) {
          addTaskToDom(task);
          const taskId = task.taskId;
          let targetDiv = document.querySelector(`[task-id="${taskId}"]`);
          targetDiv.classList.add("completed");
        }
      });
    });
  }
  //   const sideTab = document.querySelector('[project-id="upcoming"]');
  //   updateSidebarCount(sideTab, upcomingTasks.numTasks);
}

export function pageHeading(heading) {
  const text = document.createElement("p");
  text.textContent = `${heading}`;
  text.classList.add("page-heading");
  return text;
}

export function addTaskButton() {
  const div = document.createElement("div");
  const text = document.createElement("p");
  const plusButton = document.createElement("img");
  plusButton.src = plusImage;
  text.textContent = "Add New Task";
  div.classList.add("taskButtonStyle");
  div.appendChild(plusButton);
  div.appendChild(text);
  const content = document.querySelector("#content > div");
  content.appendChild(div);
  //add event listener div to call function that brings up the popup
}
