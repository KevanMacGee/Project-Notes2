/**
 * Drag and Drop module for handling drag and drop functionality
 */
const DragAndDrop = (function() {
    /**
     * Handle the drag start event
     * @param {DragEvent} e - Drag start event
     */
    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragging');
        
        // Set drag image (optional)
        const dragIcon = document.createElement('div');
        dragIcon.textContent = e.target.querySelector('.fw-bold').textContent;
        dragIcon.style.backgroundColor = 'rgba(0,0,0,0.1)';
        dragIcon.style.padding = '10px';
        dragIcon.style.borderRadius = '5px';
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
        setTimeout(() => document.body.removeChild(dragIcon), 0);
    }
    
    /**
     * Handle the drag end event
     * @param {DragEvent} e - Drag end event
     */
    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    /**
     * Handle the drag over event
     * @param {DragEvent} e - Drag over event
     */
    function handleDragOver(e) {
        e.preventDefault();
    }
    
    /**
     * Handle the drag enter event
     * @param {DragEvent} e - Drag enter event
     */
    function handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add('card-placeholder');
    }
    
    /**
     * Handle the drag leave event
     * @param {DragEvent} e - Drag leave event
     */
    function handleDragLeave(e) {
        e.currentTarget.classList.remove('card-placeholder');
    }
    
    /**
     * Handle the drop event
     * @param {DragEvent} e - Drop event
     */
    function handleDrop(e) {
        e.preventDefault();
        const rowContainer = e.currentTarget;
        rowContainer.classList.remove('card-placeholder');
        
        const taskId = e.dataTransfer.getData('text/plain');
        const taskElement = document.getElementById(taskId);
        
        if (taskElement && rowContainer.id !== taskElement.parentElement.id) {
            // Get the new status from the row
            const newStatus = rowContainer.dataset.row;
            
            // Update task in DOM
            rowContainer.appendChild(taskElement);
            taskElement.dataset.status = newStatus;
            
            // Update header color
            const header = taskElement.querySelector('.card-header');
            header.className = 'card-header d-flex justify-content-between align-items-center';
            
            switch(newStatus) {
                case 'todo': header.classList.add('bg-danger', 'bg-opacity-25'); break;
                case 'inprogress': header.classList.add('bg-warning', 'bg-opacity-25'); break;
                case 'done': header.classList.add('bg-success', 'bg-opacity-25'); break;
                case 'holding': header.classList.add('bg-info', 'bg-opacity-25'); break;
            }
            
            // Update task in localStorage
            Storage.updateTaskStatus(taskId, newStatus);
        }
    }
    
    /**
     * Initialize drag and drop functionality
     */
    function initDragAndDrop() {
        const kanbanRows = document.querySelectorAll('.row-container');
        
        kanbanRows.forEach(row => {
            row.addEventListener('dragover', handleDragOver);
            row.addEventListener('dragenter', handleDragEnter);
            row.addEventListener('dragleave', handleDragLeave);
            row.addEventListener('drop', handleDrop);
        });
    }
    
    // Public API
    return {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        initDragAndDrop
    };
})();
