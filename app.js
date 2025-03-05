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
      <div class="card-body d-flex justify-content-between">
          <textarea class="card-text task-content" 
                    data-task-id="${task.id}"
                    onfocus="this.select()">${task.content}</textarea>
          <button type="button" class="btn-close delete-task" 
                  aria-label="Delete task"
                  onclick="deleteTask('${task.id}')">
            <i class="bi bi-trash"></i>
          </button>
      </div>
  `;

  // Handle drag events
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);

  // Handle content editing and card expansion
  const textarea = card.querySelector('.task-content');
  textarea.addEventListener('blur', handleTaskEdit);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      textarea.blur();
    }
  });

  // Add click handler for expansion
  card.addEventListener('click', (e) => {
    // Don't expand if clicking delete button or selecting text
    if (e.target.classList.contains('btn-close') || 
        window.getSelection().toString()) {
      return;
    }
    toggleCardExpansion(card);
  });

  return card;
}

// Add these new functions to handle card expansion
function toggleCardExpansion(card) {
  const isExpanded = card.classList.contains('expanded');
  const overlay = getOrCreateOverlay();
  
  if (!isExpanded) {
    card.classList.add('expanded');
    overlay.classList.add('active');
    card.querySelector('.task-content').focus();
  } else {
    card.classList.remove('expanded');
    overlay.classList.remove('active');
  }
}

function getOrCreateOverlay() {
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        const expandedCard = document.querySelector('.task-card.expanded');
        if (expandedCard) {
          toggleCardExpansion(expandedCard);
        }
      }
    });
    document.body.appendChild(overlay);
  }
  return overlay;
}

/* Handle task content editing */
function handleTaskEdit(event) {
  const textarea = event.target;
  const taskId = textarea.dataset.taskId;
  const newContent = textarea.value.trim();
  
  if (!newContent) return;

  tasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, content: newContent };
    }
    return task;
  });
  
  saveTasks();
}

/* Add a new task from form data */
function addTask(event) {
  event.preventDefault();
  const contentInput = document.getElementById("taskContent");
  const content = contentInput.value.trim();
  if (!content) return;

  // Create a new task
  const task = {
    id: "task-" + Date.now(),
    content: content,
    status: "todo"
  };
  tasks.push(task);
  saveTasks();

  // Create and append the task card
  const taskCard = createTaskCard(task);
  document.getElementById("todo").appendChild(taskCard);

  // Reset form and close modal
  event.target.reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
  modal.hide();
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
