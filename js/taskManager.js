/**
 * Task Manager module for handling task creation and manipulation
 */
const TaskManager = (function() {
    /**
     * Create a task card element
     * @param {Object} task - Task object
     * @returns {HTMLElement} - Task card element
     */
    function createTaskElement(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'card kanban-card shadow-sm';
        taskCard.id = task.id;
        taskCard.draggable = true;
        taskCard.dataset.status = task.status;
        
        // Set card color based on status
        let headerClass = '';
        switch(task.status) {
            case 'todo': headerClass = 'bg-danger bg-opacity-25'; break;
            case 'inprogress': headerClass = 'bg-warning bg-opacity-25'; break;
            case 'done': headerClass = 'bg-success bg-opacity-25'; break;
            case 'holding': headerClass = 'bg-info bg-opacity-25'; break;
        }
        
        taskCard.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center ${headerClass}">
                <span class="fw-bold">${task.title}</span>
                <button type="button" class="btn-close delete-task" aria-label="Delete task"></button>
            </div>
            <div class="card-body">
                <p class="card-text">${task.description || 'No description'}</p>
            </div>
        `;
        
        // Add delete event listener
        const deleteBtn = taskCard.querySelector('.delete-task');
        deleteBtn.addEventListener('click', function() {
            Storage.deleteTask(task.id);
            taskCard.remove();
        });
        
        // Add drag event listeners
        taskCard.addEventListener('dragstart', DragAndDrop.handleDragStart);
        taskCard.addEventListener('dragend', DragAndDrop.handleDragEnd);
        
        return taskCard;
    }
    
    /**
     * Add a task to the DOM
     * @param {Object} task - Task object
     */
    function addTaskToDOM(task) {
        const taskElement = createTaskElement(task);
        const targetRow = document.getElementById(`${task.status}-row`);
        
        if (targetRow) {
            targetRow.appendChild(taskElement);
        }
    }
    
    /**
     * Add a new task to the board
     * @param {Event} e - Form submit event
     */
    function addNewTask(e) {
        e.preventDefault();
        
        const taskTitleInput = document.getElementById('task-title');
        const taskDescriptionInput = document.getElementById('task-description');
        
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        
        if (title) {
            // Create a unique ID for the task
            const taskId = 'task-' + Date.now();
            
            // Create the task object
            const task = {
                id: taskId,
                title: title,
                description: description,
                status: 'todo'
            };
            
            // Add task to the DOM
            addTaskToDOM(task);
            
            // Save to localStorage
            Storage.saveTask(task);
            
            // Reset form
            document.getElementById('task-form').reset();
        }
    }
    
    /**
     * Load tasks from localStorage
     */
    function loadTasks() {
        const tasks = Storage.getTasks();
        tasks.forEach(task => addTaskToDOM(task));
    }
    
    // Public API
    return {
        createTaskElement,
        addTaskToDOM,
        addNewTask,
        loadTasks
    };
})();
