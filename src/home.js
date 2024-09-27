import "./stylehome.css";
import { projectList } from "./project";
import { format } from "date-fns";
import dustbinImg from "./images/binbrown.svg";
import arrowImg from "./images/arrow.svg";
import calendarImg from "./images/calendarbrown.svg";
import { updateSidebarCount, createProject } from "./project";
import browninbox from "./images/inboxbrown.svg";
const { isSameDay } = require("date-fns");
const { differenceInDays } = require("date-fns");

export let upcomingTasks = {
  numTasks: 0,
  addTask: function () {
    this.numTasks = this.numTasks + 1;
    const sideTab = document.querySelector('[project-id="upcoming"]');
    updateSidebarCount(sideTab, this.numTasks);
  },
  removeTask: function () {
    this.numTasks = this.numTasks - 1;
    const sideTab = document.querySelector('[project-id="upcoming"]');
    updateSidebarCount(sideTab, this.numTasks);
  },
};

export let todaysTasks = {
  numTasks: 0,
  addTask: function () {
    this.numTasks = this.numTasks + 1;
    const sideTab = document.querySelector('[project-id="today"]');
    updateSidebarCount(sideTab, this.numTasks);
  },
  removeTask: function () {
    this.numTasks = this.numTasks - 1;
    const sideTab = document.querySelector('[project-id="today"]');
    updateSidebarCount(sideTab, this.numTasks);
  },
};

export function priorityToInt(priority) {
  if (priority === "low") return 0;
  else if (priority === "normal") return 1;
  else return 2;
}

let taskId = 0;
function taskIdGenerator() {
  return taskId++;
}

export function getTaskDetails() {
  const taskName = document.querySelector("#taskname").value;
  const description = document.querySelector("form > textarea").value;
  const dueDate = document.querySelector("form > textarea + div > input").value;
  const priority = document.querySelector('[name="priority"]:checked').value;

  const importance = priorityToInt(priority);

  const projectId = document.querySelector('[name="pname"]').value;
  const taskId = taskIdGenerator();
  let taskStatus = 0; //0 represents incomplete. 1 represents complete.

  document.querySelector("#taskname").value = "";
  document.querySelector("form > textarea").value = "";
  document.querySelector("form > textarea + div > input").value = "";
  document.querySelector('[name="priority"]:checked').value = "";

  return {
    taskName,
    dueDate,
    importance,
    projectId,
    description,
    taskId,
    taskStatus,
  };
}

(function newTaskValuesForm() {
  let form = document.querySelector("#addtaskform > form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const dateValue = new Date(document.querySelector("#duedate").value);
    dateValue.setHours(23, 59, 59, 59);
    console.log(dateValue);
    const todaysDate = new Date();
    console.log(todaysDate);
    if (dateValue < todaysDate) {
      const error = document.querySelector("#date-error");
      error.textContent = "Can't enter dates before today";
      error.style.display = "block";
      return;
    }
    const error = document.querySelector("#date-error");
    error.style.display = "none";

    let newTask = getTaskDetails();
    addTaskToProject(newTask);
    addTaskToStorage(newTask);

    upcomingTasks.addTask();
    //to add to today list
    if (isSameDay(newTask.dueDate, new Date())) {
      todaysTasks.addTask();
    }

    let pId = Number(newTask.projectId);

    let project = projectList.find((project) => project.pId === pId);
    if (pId === 0) {
      pId = "inbox";
    }
    let sideTab = document.querySelector(`[project-id="${pId}"]`);
    console.log(sideTab);
    updateSidebarCount(sideTab, project.numtasks());

    const activeWindow = document.querySelector(".active-nav");
    if (activeWindow.getAttribute("project-id") === "upcoming")
      addTaskToDom(newTask);
    else if (activeWindow.getAttribute("project-id") === "today") {
      if (isSameDay(newTask.dueDate, new Date())) {
        addTaskToDom(newTask);
      }
    } else if (
      activeWindow.getAttribute("project-id") === "inbox" &&
      newTask.projectId === "0"
    ) {
      addTaskToDom(newTask);
    } else if (activeWindow.getAttribute("project-id") === newTask.projectId) {
      addTaskToDom(newTask);
    }

    let dialog = document.querySelector("#addtaskform");
    dialog.close();
  });
})();

export function addTaskToProject(task) {
  let pId = Number(task.projectId);
  let project = projectList.find((tproject) => tproject.pId === pId);
  project.addTask(task);
}

export function importanceToString(num) {
  if (num === 0) return "low";
  else if (num === 1) return "normal";
  else return "important";
}

function showTaskInformation(div, task) {
  div.addEventListener("click", (event) => {
    console.log(event.target);
    console.log(event.currentTarget);
    if (
      event.target !== event.currentTarget &&
      !event.target.classList.contains("taskcardsection1") &&
      !event.target.classList.contains("task-details") &&
      !event.target.classList.contains("task-priority") &&
      !event.target.classList.contains("taskcard-project") &&
      !event.target.classList.contains("timeleft") &&
      !event.target.classList.contains("open-the-task-info")
    ) {
      return;
    }
    const dialog = document.querySelector("#details-of-task");
    dialog.showModal();
    const taskname = document.querySelector(
      ".details-of-task-content> .task-name> p"
    );
    taskname.textContent = task.taskName;
    const date = document.querySelector(
      ".details-of-task-content >.deadline >p:last-child"
    );
    date.textContent = task.dueDate;
    const project = document.querySelector(
      ".details-of-task-content > .name-of-project > .details-of-project >p"
    );

    let projectId = Number(task.projectId);
    let currentProject = projectList.find(
      (project) => project.pId === projectId
    );
    project.textContent = currentProject.getName;
    if (currentProject.pId === 0) {
      const projectColor = document.querySelector(
        ".details-of-task-content > .name-of-project > .details-of-project > div"
      );
      const projectImage = document.createElement("img");
      projectImage.src = browninbox;
      projectColor.appendChild(projectImage);
    } else {
      const projectColor = document.querySelector(
        ".details-of-task-content > .name-of-project > .details-of-project > div"
      );
      projectColor.classList.add("colorBox");
      projectColor.style.backgroundColor = `${currentProject.getColor}`;
    }
    const taskPriority = document.querySelector(
      ".details-of-task-content > .priority-of-task >p:last-child"
    );
    taskPriority.textContent = importanceToString(task.importance);
    const description = document.querySelector(
      ".details-of-task-content > .description-of-project > p:last-child"
    );
    description.textContent = task.description;
  });
}

export function addTaskToDom(task) {
  const div = document.createElement("div");
  div.classList.add("taskcard");
  div.setAttribute("task-id", `${task.taskId}`);

  const taskcardSection1 = document.createElement("div");
  taskcardSection1.classList.add("taskcardsection1");

  const checkButton = document.createElement("button");
  checkButton.setAttribute("task-id", `${task.taskId}`);
  const name = document.createElement("p");
  name.textContent = `${task.taskName}`;
  taskcardSection1.appendChild(checkButton);
  checkButton.addEventListener("click", (event) => {
    let taskId = event.target.getAttribute("task-id");
    let targetDiv = document.querySelector(`[task-id="${taskId}"]`);
    if (targetDiv.classList.contains("completed")) {
      //task should be reinstated
      targetDiv.classList.remove("completed");
      completeToPending(Number(taskId));
    } else {
      //task should be completed
      targetDiv.classList.add("completed");
      pendingToComplete(Number(taskId));
    }
  });

  taskcardSection1.appendChild(name);
  const optionBox = document.createElement("div");
  const bin = document.createElement("img");
  bin.setAttribute("task-id", `${task.taskId}`);
  const arrow = document.createElement("img");
  bin.src = dustbinImg;
  arrow.src = arrowImg;
  arrow.classList.add("open-the-task-info");
  optionBox.appendChild(bin);
  optionBox.appendChild(arrow);
  optionBox.classList.add("taskactions");
  bin.addEventListener("click", (event) => {
    console.log("bin clickecd");
    const taskId = event.target.getAttribute("task-id");
    deleteTask(Number(taskId));
  });
  taskcardSection1.appendChild(optionBox);

  div.appendChild(taskcardSection1);

  const taskDetails = document.createElement("div");
  taskDetails.classList.add("task-details");
  const timeLeft = document.createElement("div");
  timeLeft.classList.add("timeleft");
  const calendar = document.createElement("img");
  calendar.src = calendarImg;
  const numHours = document.createElement("p");
  numHours.textContent = `${task.dueDate}`;
  timeLeft.appendChild(calendar);
  timeLeft.appendChild(numHours);
  taskDetails.appendChild(timeLeft);

  const projName = document.createElement("div");
  projName.classList.add("taskcard-project");

  let project = projectList.find(
    (project) => project.pId === Number(task.projectId)
  );

  if (task.projectId === "0") {
    let proColor = document.createElement("img");
    proColor.src = browninbox;
    projName.appendChild(proColor);
  } else {
    const proColor = document.createElement("div");
    proColor.style.backgroundColor = `${project.getColor}`;
    projName.appendChild(proColor);
  }
  const pName = document.createElement("p");
  pName.textContent = `${project.getName}`;
  projName.appendChild(pName);
  taskDetails.appendChild(projName);

  const priority = document.createElement("p");
  priority.textContent = `${importanceToString(task.importance)}`;
  priority.classList.add("task-priority");
  if (priority.textContent === "important") {
    priority.style.backgroundColor = "#E76F51";
  } else if (priority.textContent === "normal") {
    priority.style.backgroundColor = "#2A9D8F";
  } else if (priority.textContent === "low") {
    priority.style.backgroundColor = "#264653";
  }
  taskDetails.appendChild(priority);

  div.appendChild(taskDetails);

  const content = document.querySelector("#content > div");
  content.appendChild(div);

  //to bring the popup
  showTaskInformation(div, task);
}

//should be taken care of when side elements are rendered
(function formToAddTask() {
  let dialogAddTask = document.querySelector(".taskoptions > .addtask");
  let dialog = document.querySelector("#addtaskform");
  dialogAddTask.addEventListener("click", () => {
    dialog.showModal();
  });
})();

(function inboxTaskButton() {
  document.querySelector;
})();

function taskDetailsPopup() {}

function pendingToComplete(taskId) {
  projectList.forEach((project) => {
    const index = project.tasks.findIndex((task) => task.taskId === taskId);
    if (index !== -1) {
      let taskobj = project.tasks[index];
      project.tasks.splice(index, 1);
      project.completedTasks.push(taskobj);
      upcomingTasks.removeTask();
      if (isSameDay(taskobj.dueDate, new Date())) {
        todaysTasks.removeTask();
      }
      let pId = taskobj.projectId;
      if (taskobj.projectId === "0") {
        pId = "inbox";
      }
      const sideTab = document.querySelector(`[project-id="${pId}"]`);
      updateSidebarCount(sideTab, project.tasks.length);
    }
  });
}

function completeToPending(taskId) {
  projectList.forEach((project) => {
    const index = project.completedTasks.findIndex(
      (task) => task.taskId === taskId
    );
    if (index !== -1) {
      let taskobj = project.completedTasks[index];
      project.completedTasks.splice(index, 1);
      project.tasks.push(taskobj);
      upcomingTasks.addTask();
      if (isSameDay(taskobj.dueDate, new Date())) {
        todaysTasks.addTask();
      }
      let pId = taskobj.projectId;
      if (taskobj.projectId === "0") {
        pId = "inbox";
      }
      const sideTab = document.querySelector(`[project-id="${pId}"]`);
      updateSidebarCount(sideTab, project.tasks.length);
    }
  });
}

function deleteTask(taskId) {
  console.log(taskId);
  let taskDeleted = 0;
  projectList.forEach((project) => {
    const index = project.tasks.findIndex((task) => task.taskId === taskId);
    if (index !== -1) {
      console.log("found task");
      let taskobj = project.tasks[index];
      project.tasks.splice(index, 1);
      upcomingTasks.removeTask();
      if (isSameDay(taskobj.dueDate, new Date())) {
        todaysTasks.removeTask();
      }
      let pId = taskobj.projectId;
      if (taskobj.projectId === "0") {
        pId = "inbox";
      }
      const sideTab = document.querySelector(`[project-id="${pId}"]`);
      updateSidebarCount(sideTab, project.tasks.length);
      taskDeleted = 1;
      let taskindom = document.querySelector(`#content [task-id="${taskId}"]`);
      taskindom.remove();
    }
  });

  if (taskDeleted === 0) {
    projectList.forEach((project) => {
      const index = project.completedTasks.findIndex(
        (task) => task.taskId === taskId
      );
      if (index !== -1) {
        let taskobj = project.completedTasks[index];
        project.completedTasks.splice(index, 1);
        let taskindom = document.querySelector(
          `#content [task-id="${taskId}"]`
        );
      }
    });
  }
}

(function closeCreateTaskForm() {
  const closeButton = document.querySelector("#addtaskform > img");
  closeButton.addEventListener("click", (event) => {
    const dialog = document.querySelector("#addtaskform");
    dialog.close();
  });
})();

(function closeTaskInfoPopup() {
  const closeButton = document.querySelector(
    ".details-of-task-content > .task-name > img"
  );
  closeButton.addEventListener("click", (event) => {
    const dialog = document.querySelector("#details-of-task");
    dialog.close();
  });
})();

function addTaskToStorage(task) {
  let project = JSON.parse(localStorage.getItem(task.projectId));
  localStorage.removeItem(task.projectId);
  project.addTask = function (task) {
    this.tasks.push(task);
  };
  project.addTask(task);
  localStorage.setItem(task.projectId, JSON.stringify(project));
}
