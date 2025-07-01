const initialTasks = [
    { id: 1, name: 'Work on a painting', completed: true },
    { id: 2, name: 'Write a short story', completed: false },
    { id: 3, name: 'Learn a new coding language', completed: true },
    { id: 4, name: 'Start a new hobby', completed: false },
    { id: 5, name: 'Work on a craft project', completed: false },
]

const todo = document.getElementsByClassName('todo')[0];
const newTaskInput = document.getElementById('newTask');
const filterInput = document.querySelectorAll('.filterBox input');
const taskBoxElement = document.getElementsByClassName('taskBox')[0];
const taskListContainer = document.getElementById('taskList');
const taskList = taskListContainer.children;
const emptyTaskElement = document.querySelector('.empty');
const deleteAllButton = document.querySelector('.deleteAll')

function addItem() {
    const taskName = newTaskInput.value;
    if (taskName === '') return;
    const taskId = Date.now();
    const newTask = { id: taskId, name: taskName, completed: false };
    saveTask(newTask);
    newTaskInput.value = '';
    renderTasks();
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

function clearCompleted() {
    const tasks = getTasks();
    tasks.forEach(task => {
        if (task.completed) deleteTask(task.id)
    });
}


function toggleTaskCompletion(checkbox, taskId) {
    const tasks = getTasks().map(task => {
        if (task.id == taskId) {
            task.completed = checkbox.checked;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    checkbox.nextElementSibling.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    filterTasks();
}

function deleteTask(taskId) {

    const tasks = getTasks().filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log(taskId, tasks);
    renderTasks();
}
function deleteAllTasks() {
    const tasks = getTasks();
    const selectedFilter = [...filterInput].find(filter => filter.checked).value;
    tasks.forEach(task => {
        if (selectedFilter === 'all' || (task.completed && selectedFilter === 'completed') || (!task.completed && selectedFilter === 'pending')) deleteTask(task.id);
    });
}

function saveTask(task) {
    let tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    let tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : initialTasks;
}


function filterTasks() {

    const selectedFilter = [...filterInput].find(filter => filter.checked).value;

    [...taskList].forEach(task => {

        const isCompleted = task.querySelector('input[type="checkbox"]').checked;

        if ((selectedFilter === 'pending' && isCompleted) || (selectedFilter === 'completed' && !isCompleted)) {
            task.style.display = 'none';
        } else {
            task.removeAttribute('style');
        }

    });

    deleteAllButton.querySelector('span').innerHTML = `Delete ${selectedFilter[0].toUpperCase() + selectedFilter.substr(1)} Tasks`

    const isEmpty = [...taskList].every(task => task.style.display === 'none');

    if (isEmpty) {
        deleteAllButton.style.display = 'none';
        emptyTaskElement.removeAttribute('style');
        emptyTaskElement.querySelector('p').innerHTML = `There is no ${selectedFilter} task`;
    } else {
        deleteAllButton.removeAttribute('style');
        emptyTaskElement.style.display = 'none';
    }
}

function renderTasks() {
    const tasks = getTasks();
    taskListContainer.innerHTML = '';

    tasks.forEach(task => {
        const html = `<li data-taskid="${task.id}"><input type="checkbox" id="${task.id}" onchange="toggleTaskCompletion(this, this.closest('li').dataset.taskid)" ${task.completed ? 'checked' : ''}><label for="${task.id}" class="taskName" style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.name}</label><img src="./images/cross.svg" width="14" alt="cross" onclick="deleteTask(this.closest('li').dataset.taskid)"></li>`;
        taskListContainer.insertAdjacentHTML('beforeend', html);
    });

    if (taskListContainer.children.length > 0) {
        taskBoxElement.hidden = false;
        todo.style.transform = 'initial';
    } else {
        taskBoxElement.hidden = true;
        todo.style.transform = 'scale(1.5)';
    }
    filterTasks();
}

renderTasks();