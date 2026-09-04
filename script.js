/**
 * PaperFlow — Personal Planner & Task Web Application
 * Core JavaScript Logic (Vanilla JS & localStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. STATE MANAGEMENT
  // =========================================================================
  const STORAGE_KEY = 'paperflow_tasks_data';

  // Application state variables
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'
  let searchQuery = '';

  // =========================================================================
  // 2. DOM ELEMENT REFERENCES
  // =========================================================================
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const inputError = document.getElementById('input-error');
  const taskList = document.getElementById('task-list');
  const searchInput = document.getElementById('search-input');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const emptyState = document.getElementById('empty-state');
  const emptyTitle = document.getElementById('empty-title');
  const emptySubtitle = document.getElementById('empty-subtitle');

  // Stat counters
  const statTotal = document.getElementById('stat-total');
  const statActive = document.getElementById('stat-active');
  const statCompleted = document.getElementById('stat-completed');

  // =========================================================================
  // 3. STORAGE FUNCTIONS (localStorage API)
  // =========================================================================

  /**
   * Safely loads tasks from localStorage. Handles invalid JSON scenarios.
   */
  function loadTasks() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        tasks = [];
        return;
      }
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        tasks = parsed;
      } else {
        console.warn('PaperFlow: Stored tasks data was invalid. Resetting state.');
        tasks = [];
      }
    } catch (error) {
      console.error('PaperFlow: Error parsing localStorage data:', error);
      tasks = [];
    }
  }

  /**
   * Saves current tasks array to localStorage.
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('PaperFlow: Could not save tasks to localStorage:', error);
    }
  }

  // =========================================================================
  // 4. TASK CORE ACTIONS
  // =========================================================================

  /**
   * Adds a new task to the array.
   * @param {string} title - The text for the task.
   */
  function addTask(title) {
    const trimmedTitle = title.trim();

    // Validation check
    if (!trimmedTitle) {
      showValidationError('Please enter a task before adding.');
      return;
    }

    clearValidationError();

    const newTask = {
      id: Date.now().toString(), // Simple unique ID generation based on timestamp
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask); // Add to beginning of array
    saveTasks();
    render();

    // Reset input field
    taskInput.value = '';
    taskInput.focus();
  }

  /**
   * Toggles task completion state.
   * @param {string} id - Task ID.
   */
  function toggleTask(id) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    render();
  }

  /**
   * Deletes a task by ID.
   * @param {string} id - Task ID.
   */
  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    render();
  }

  /**
   * Edits an existing task's title.
   * @param {string} id - Task ID.
   * @param {string} newTitle - The updated text.
   */
  function editTask(id, newTitle) {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      // If user clears the text while editing, cancel edit or ignore
      render();
      return;
    }

    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, title: trimmedTitle };
      }
      return task;
    });

    saveTasks();
    render();
  }

  /**
   * Clears all tasks that are currently completed.
   */
  function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    render();
  }

  // =========================================================================
  // 5. VALIDATION & ERROR HANDLING
  // =========================================================================
  function showValidationError(message) {
    inputError.textContent = message;
    taskInput.style.borderColor = 'var(--terracotta)';
  }

  function clearValidationError() {
    inputError.textContent = '';
    taskInput.style.borderColor = 'var(--border-color)';
  }

  // =========================================================================
  // 6. COMPUTED DATA & UI RENDERERS
  // =========================================================================

  /**
   * Calculates statistics and updates UI counters.
   */
  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;
  }

  /**
   * Filters and searches tasks based on current state.
   * @returns {Array} List of filtered tasks.
   */
  function getFilteredTasks() {
    return tasks.filter(task => {
      // Apply status filter
      if (currentFilter === 'active' && task.completed) return false;
      if (currentFilter === 'completed' && !task.completed) return false;

      // Apply search query (case-insensitive)
      if (searchQuery) {
        return task.title.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }

  /**
   * Renders the task list DOM elements and controls empty states.
   */
  function render() {
    updateStats();
    const visibleTasks = getFilteredTasks();

    // Clear current list content
    taskList.innerHTML = '';

    // Handle Empty States
    if (visibleTasks.length === 0) {
      emptyState.classList.remove('hidden');

      if (tasks.length === 0) {
        emptyTitle.textContent = 'Your task list is clear.';
        emptySubtitle.textContent = "Add something you'd like to accomplish today.";
      } else if (searchQuery) {
        emptyTitle.textContent = 'No matching tasks found.';
        emptySubtitle.textContent = 'Try adjusting your search query.';
      } else if (currentFilter === 'active') {
        emptyTitle.textContent = 'No active tasks.';
        emptySubtitle.textContent = 'You have finished everything on your list!';
      } else if (currentFilter === 'completed') {
        emptyTitle.textContent = 'No completed tasks yet.';
        emptySubtitle.textContent = 'Mark tasks complete as you finish them.';
      }
    } else {
      emptyState.classList.add('hidden');

      // Build task cards
      visibleTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
          <div class="task-left">
            <label class="checkbox-container">
              <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete" />
              <span class="checkmark"></span>
            </label>
            <span class="task-title"></span>
          </div>
          <div class="task-actions">
            <button class="btn-action edit-btn" type="button" aria-label="Edit task">Edit</button>
            <button class="btn-action delete-btn" type="button" aria-label="Delete task">Delete</button>
          </div>
        `;

        // Text content assigned via textContent to prevent XSS vulnerability
        li.querySelector('.task-title').textContent = task.title;

        taskList.appendChild(li);
      });
    }
  }

/**
   * Switches item to inline edit form mode.
   * @param {HTMLElement} taskItemEl - The parent LI element.
   * @param {string} taskId - Task ID.
   */
  function enableInlineEdit(taskItemEl, taskId) {
    const taskObj = tasks.find(t => t.id === taskId);
    if (!taskObj) return;

    taskItemEl.innerHTML = `
      <form class="edit-form">
        <input type="text" class="edit-input" value="" aria-label="Edit task title" />
        <button type="submit" class="btn-action save-btn">Save</button>
      </form>
    `;

    const editForm = taskItemEl.querySelector('.edit-form');
    const editInput = taskItemEl.querySelector('.edit-input');

    // Securely set the value without HTML encoding issues
    editInput.value = taskObj.title;
    editInput.focus();
    // Place cursor at the end of the text
    editInput.setSelectionRange(editInput.value.length, editInput.value.length);

    // Single unified handler to perform the save action safely
    const handleSave = () => {
      const updatedText = editInput.value.trim();
      if (updatedText) {
        editTask(taskId, updatedText);
      } else {
        // If text is empty on save, re-render to restore original task title
        render();
      }
    };

    // Handle form submit (clicking Save or pressing Enter)
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleSave();
    });

    // Handle Escape key to cancel editing without changing anything
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        render();
      }
    });
  }


  // =========================================================================
  // 7. EVENT LISTENERS
  // =========================================================================

  // Submit New Task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
  });

  // Clear validation warning as user types
  taskInput.addEventListener('input', () => {
    if (taskInput.value.trim()) {
      clearValidationError();
    }
  });

  // Task List Delegation Listener (Checkbox toggle, Edit, Delete clicks)
  taskList.addEventListener('click', (e) => {
    const taskItemEl = e.target.closest('.task-item');
    if (!taskItemEl) return;

    const taskId = taskItemEl.dataset.id;

    // Toggle complete
    if (e.target.matches('input[type="checkbox"]') || e.target.matches('.checkmark')) {
      toggleTask(taskId);
      return;
    }

    // Delete task
    if (e.target.classList.contains('delete-btn')) {
      deleteTask(taskId);
      return;
    }

    // Edit task
    if (e.target.classList.contains('edit-btn')) {
      enableInlineEdit(taskItemEl, taskId);
      return;
    }
  });

  // Real-time Search Listener
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    render();
  });

  // Filter Tab Button Listeners
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      currentFilter = tab.dataset.filter;
      render();
    });
  });

  // Clear Completed Button Listener
  clearCompletedBtn.addEventListener('click', () => {
    clearCompleted();
  });

  // =========================================================================
  // 8. INITIALIZATION
  // =========================================================================
  loadTasks();
  render();
});