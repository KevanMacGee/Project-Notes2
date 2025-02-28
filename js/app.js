/**
 * Main application module
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners
    document.getElementById('task-form').addEventListener('submit', TaskManager.addNewTask);
    
    // Initialize drag and drop
    DragAndDrop.initDragAndDrop();
    
    // Load tasks from localStorage
    TaskManager.loadTasks();
});
