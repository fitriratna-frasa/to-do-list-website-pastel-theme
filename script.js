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