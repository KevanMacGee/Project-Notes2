/**
 * Storage module for handling localStorage operations
 */
const Storage = (function() {
    /**
     * Save a task to localStorage
     * @param {Object} task - Task object
     */
    function saveTask(task) {
        let tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }
    
    /**
     * Get all tasks from localStorage
     * @returns {Array} - Array of task objects
     */
    function getTasks() {
        const tasksJSON = localStorage.getItem('kanbanTasks');
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }
    
    /**
     * Update a task's status in localStorage
     * @param {string} taskId - Task ID
     * @param {string} newStatus - New status
     */
    function updateTaskStatus(taskId, newStatus) {
        let tasks = getTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
        }
    }
    
    /**
     * Delete a task from localStorage
     * @param {string} taskId - Task ID
     */
    function deleteTask(taskId) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }
    
    // Public API
    return {
        saveTask,
        getTasks,
        updateTaskStatus,
        deleteTask
    };
})();
