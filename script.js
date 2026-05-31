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
    } catch (e) {
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
    } catch (e) {
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
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const filtered = getFilteredTasks();
    filtered.forEach((task) => {
        taskList.appendChild(renderTaskItem(task));
    });

    updateEmptyState();
}

function updateEmptyState() {
    const emptyMessage = document.getElementById('empty-message');
    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
        emptyMessage.style.display = '';
    } else {
        emptyMessage.style.display = 'none';
    }
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
}

function clearError() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
}

function updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
        if (btn.getAttribute('data-filter') === currentFilter) {
            btn.classList.add('filter-btn--active');
        } else {
            btn.classList.remove('filter-btn--active');
        }
    });
}

// ============================================================
// Event Handlers
// ============================================================

function handleFormSubmit(e) {
    e.preventDefault();
    const taskInput = document.getElementById('task-input');
    const value = taskInput.value;

    if (value.trim() === '') {
        showError('Tugas tidak boleh kosong');
        return;
    }

    addTask(value);
    clearError();
    taskInput.value = '';
    renderList();
}

function handleTaskClick(e) {
    if (e.target.classList.contains('task-checkbox')) {
        const id = e.target.closest('.task-item').dataset.id;
        toggleTask(id);
        renderList();
    }

    if (e.target.classList.contains('btn-delete')) {
        const id = e.target.closest('.task-item').dataset.id;
        deleteTask(id);
        renderList();
    }
}

function handleFilterClick(e) {
    const filter = e.currentTarget.getAttribute('data-filter');
    currentFilter = filter;
    updateFilterButtons();
    renderList();
}

function init() {
    if (!isStorageAvailable()) {
        document.getElementById('storage-warning').removeAttribute('hidden');
    }

    loadTasks();
    renderList();

    document.getElementById('task-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('task-list').addEventListener('click', handleTaskClick);
    document.querySelectorAll('.filter-btn').forEach((btn) =>
        btn.addEventListener('click', handleFilterClick)
    );
    document.getElementById('task-input').addEventListener('input', clearError);
}

document.addEventListener('DOMContentLoaded', init);