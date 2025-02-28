/* app.js */

// Global array to hold task objects
let tasks = [];

/* Initialize board: load tasks, render board, and attach event listeners */
document.addEventListener("DOMContentLoaded", () => {
  // Load tasks from localStorage or initialize empty array
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks();

  // Set up drag and drop event listeners for each task container
  const containers = document.querySelectorAll(".task-container");
  containers.forEach(container => {
    container.addEventListener("dragover", allowDrop);
    container.addEventListener("drop", drop);
    container.addEventListener("dragenter", (event) => {
      event.preventDefault();
      container.classList.add("drag-over");
    });
    container.addEventListener("dragleave", () => {
      container.classList.remove("drag-over");
    });
  });

  // Attach submit event listener to task creation form
  document.getElementById("taskForm").addEventListener("submit", addTask);
});

/* Render tasks on the board by status */
function renderTasks() {
  // Clear each container
  const statuses = ["todo", "in-progress", "done", "holding"];
  statuses.forEach(status => {
    document.getElementById(status).innerHTML = "";
  });

  // For each task, create a card and append to appropriate container
  tasks.forEach(task => {
    const taskCard = createTaskCard(task);
    document.getElementById(task.status).appendChild(taskCard);
  });
}

/* Create a Bootstrap task card element */
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'card task-card';
  card.draggable = true;
  card.id = task.id;

  card.innerHTML = `
      <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">${task.title}</h5>
          <button type="button" class="btn btn-link delete-task p-0" 
                  aria-label="Delete task">
              <i class="bi bi-trash"></i>
          </button>
      </div>
      <div class="card-body">
          <p class="card-text">${task.description}</p>
      </div>
  `;

  // Add event listener for delete button
  card.querySelector('.delete-task').addEventListener('click', () => {
      card.remove();
      deleteTask(task.id);
  });

  // Handle drag events
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);

  return card;
}

/* Add a new task from form data */
function addTask(event) {
  event.preventDefault();
  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDescription");
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  if (!title || !description) return;

  // Create a new task with a unique id and default status "todo"
  const task = {
    id: "task-" + Date.now(),
    title: title,
    description: description,
    status: "todo"
  };
  tasks.push(task);
  saveTasks();

  // Create and append the task card to the "To Do" row
  const taskCard = createTaskCard(task);
  document.getElementById("todo").appendChild(taskCard);

  // Clear form inputs for new task entries
  titleInput.value = "";
  descInput.value = "";
}

/* Delete a task by its id */
function deleteTask(taskId) {
  // Remove task from tasks array and update localStorage
  tasks = tasks.filter(task => task.id !== taskId);
  const taskCard = document.getElementById(taskId);
  if (taskCard) {
    taskCard.parentNode.removeChild(taskCard);
  }
  saveTasks();
}

/* Drag event handler: store the task id in the dataTransfer object */
function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.target.classList.add("dragging");
}

/* Drag event handler: remove visual indicator after dragging ends */
function dragEnd(event) {
  event.target.classList.remove("dragging");
}

/* Allow drop by preventing default behavior */
function allowDrop(event) {
  event.preventDefault();
}

/* Drop event handler: append the task card to the new container and update its status */
function drop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");
  const taskId = event.dataTransfer.getData("text/plain");
  const taskCard = document.getElementById(taskId);
  // Append the task card to the drop target container
  event.currentTarget.appendChild(taskCard);
  updateTaskStatus(taskId, event.currentTarget.id);
}

/* Update the status of a task in the tasks array and persist changes */
function updateTaskStatus(taskId, newStatus) {
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, status: newStatus };
    }
    return task;
  });
  saveTasks();
}

/* Save the tasks array to localStorage */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
