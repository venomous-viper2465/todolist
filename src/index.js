import {
  addTaskToProject,
  loadInbox,
  loadToday,
  loadUpcoming,
  loadProject,
  upcomingTasks,
  todaysTasks,
} from "./home";
import {
  projectList,
  createProject,
  projectToSidebar,
  updateSidebarCount,
} from "./project";
import { loadMainPage, loadProjectPage } from "./pageloader.js";
const { isSameDay } = require("date-fns");
const { differenceInDays } = require("date-fns");

if (localStorage.length !== 0) {
  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i);
    const project = JSON.parse(localStorage.getItem(key));
    project.addTask = function (task) {
      this.tasks.push(task);
    };
    project.numtasks = function () {
      return this.tasks.length;
    };
    projectList.push(project);
  }
}
//inbox is the default project created
let inbox = createProject("inbox", "#FF6B6B");
projectList.push(inbox);
if (localStorage.getItem(0) === null) {
  localStorage.setItem("0", JSON.stringify(inbox));
}

loadMainPage("inbox");
const inboxNode = document.querySelector('[project-id="inbox"]');
updateSidebarCount(inboxNode, inbox.numtasks());

const upcomingNode = document.querySelector('[project-id="upcoming"]');
updateSidebarCount(upcomingNode, upcomingTasks.numTasks);

const todayNode = document.querySelector('[project-id="today"]');
updateSidebarCount(todayNode, todaysTasks.numTasks);
