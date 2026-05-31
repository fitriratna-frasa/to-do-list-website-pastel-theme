const STORAGE_KEY = 'todo_list_website';

let tasks = [];
let currentFilter = 'all';

// ============================================================
// Utilitas localStorage
// ============================================================
function isStorageAvailable() {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

// save task
function saveTasks() {
    if (!isStorageAvailable()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// load task
function loadTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        tasks = data ? JSON.parse(data) : [];
    } catch {
        tasks = [];
    }
}

// ============================================================
// State Mutations
// ============================================================
// add task
function addTask(text) {
    const newTask = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
    };
    tasks.unshift(newTask);
    saveTasks();
}

// toggle task
function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
    }
}

// delete task
function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
}

// ============================================================
// DOM Rendering
// ============================================================
function renderTaskItem(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add('task-item--completed');
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Tandai selesai: ' + task.text);

    // Label text
    const label = document. createElement('label');
    label.className = 'task-label';
    label.textContent = task.text;

    // Delete button
    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.className = 'btn-delete';
    btnDelete.textContent = 'Hapus';
    btnDelete.setAttribute('aria-label', 'Hapus tugas: ' + task.text);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(btnDelete);

    return li;
}

function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter((t) => !t.completed);
    }
    if (currentFilter === 'completed') {
        return tasks.filter((t) => t.completed);
    }

    return tasks;
}

function renderList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const filtered = getFilteredTasks();
    filtered.forEach((task) => {
        taskList.appendChild(renderTaskItem(task));
    });

    updateEmptyState();
}

function updateEmptyState() {
    const emptyMessage = document.getElementById('emptyMessage');
    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
        emptyMessage.style.display = '';
    } else {
        emptyMessage.style.display = 'none';
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
}

function clearError() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
}

function updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
        if (btn.dataset('data-filter') === currentFilter) {
            btn.classList.add('filter-btn--active');
        } else {
            btn.classList.remove('filter-btn--active');
        }
    });
}