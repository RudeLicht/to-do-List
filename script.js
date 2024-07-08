const addButton = document.getElementById('addBtn');
const taskContainer = document.getElementById('taskCont');
const projectHeader = document.getElementById('projectName');
const pickNameButton = document.getElementById('submitProjectName');
const pickNameContainer = document.getElementById('pickProjectName');
const pickTaskButton = document.getElementById('submitTaskName');
const pickTaskContainer = document.getElementById('pickTaskName');
const taskNameInput = document.getElementById('taskNameInput');
const projectNameInput = document.getElementById('projectNameInput');
const buttonContainer = document.getElementById('all-buttons');
const deleteButton = document.getElementById('deleteBtn');
const headerWarper = document.getElementById('headerWarper');
const editImage = document.getElementById('edit_img');
const closeTaskNameBtn = document.getElementById('closeTaskName');

function initializePage() {
    headerWarper.style.display = 'none';
    buttonContainer.style.display = 'none';

    loadProjectName();
    loadTasks();

    checkSavedProjectName();
}

function checkSavedProjectName() {
    const savedName = localStorage.getItem('projectName');
    if (savedName) {
        projectHeader.innerHTML = savedName;
        headerWarper.style.display = 'flex';
        buttonContainer.style.display = 'flex';
        pickNameContainer.style.display = 'none';
    } else {
        headerWarper.style.display = 'none';
        buttonContainer.style.display = 'none';
        pickNameContainer.style.display = 'block';
        projectNameInput.focus();
    }
}

deleteButton.onclick = function () {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(task => {
        task.setAttribute('position', 'fixed');
        task.classList.add('delete-animation');
        task.addEventListener('animationend', () => {
            task.remove();
            saveTasks(); 
        });
    });
};

editImage.onclick = function () {
    pickNameContainer.style.display = 'block';
    if (projectHeader.innerHTML !== "" || projectHeader.innerHTML !== null) {
        projectNameInput.value = projectHeader.innerHTML;
    }
    projectNameInput.focus();
};

pickNameButton.onclick = function () {
    let projectName = projectNameInput.value.trim();
    if (projectName === "" || projectName.length > 40) {
        alert("Please enter a valid project name (up to 40 characters).");
        return;
    }
    projectHeader.innerHTML = projectName;
    saveProjectName(projectName);

    pickNameContainer.classList.add('go-top-animation');
    pickNameContainer.addEventListener('animationend', function handleAnimationEnd() {
        pickNameContainer.classList.remove('go-top-animation');
        pickNameContainer.style.display = 'none';
        pickNameContainer.removeEventListener('animationend', handleAnimationEnd);
    });

    buttonContainer.style.display = 'flex';
    headerWarper.style.display = 'flex';
};

addButton.onclick = function () {
    pickTaskContainer.classList.remove("go-top-animation");
    pickTaskContainer.style.display = 'block';
    taskNameInput.focus();
};

taskNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});

pickTaskButton.onclick = function () {
    addTask();
};

closeTaskNameBtn.onclick = function () {
    taskNameInput.value = "";
    pickTaskContainer.classList.add('go-top-animation');
    pickTaskContainer.addEventListener('animationend', function handleAnimationEnd() {
        pickTaskContainer.classList.remove('go-top-animation');
        pickTaskContainer.style.display = 'none';
        pickTaskContainer.removeEventListener('animationend', handleAnimationEnd);
    });
};

function addTask() {
    let taskName = taskNameInput.value.trim();
    if (taskName === "" || taskName.length > 100) {
        alert("Please enter a valid task name (up to 100 characters).");
        return;
    }

    let taskClass = taskName.replace(/\s+/g, '_');

    let taskItem = document.createElement("div");
    taskItem.setAttribute("class", "task-item " + taskClass);

    let checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");

    let task = document.createElement("label");
    task.textContent = taskName;

    let btn = document.createElement("button");
    btn.textContent = "X";
    btn.addEventListener('click', function () {
        taskItem.classList.add('delete-animation');
        taskItem.addEventListener('animationend', () => {
            taskItem.remove();
            saveTasks(); 
        });
    });

    let notes = document.createElement("button");
    notes.setAttribute("id", "noteBtn");
    notes.textContent = "Notes";
    notes.addEventListener('click', function () {
        toggleNotes(taskItem);
        taskItem.querySelector('.noteInput').focus();
        saveTasks();
    });

    let noteContainer = document.createElement("div");
    noteContainer.setAttribute("class", "note-container");
    noteContainer.style.display = "none";

    let noteInput = document.createElement("textarea");
    noteInput.setAttribute("class", "noteInput");

    let exitNotes = document.createElement("button");
    exitNotes.textContent = "X";
    exitNotes.onclick = function () {
        noteContainer.classList.add('delete-animation');
        noteContainer.addEventListener('animationend', function handleAnimationEnd() {
            noteContainer.classList.remove('delete-animation');
            noteContainer.style.display = "none";
            noteContainer.removeEventListener('animationend', handleAnimationEnd);
            saveTasks(); 
        });
    };

    noteContainer.appendChild(noteInput);
    noteContainer.appendChild(exitNotes);

    taskItem.appendChild(checkBox);
    taskItem.appendChild(task);
    taskItem.appendChild(noteContainer);
    taskItem.appendChild(notes);
    taskItem.appendChild(btn);
    taskItem.classList.add('go-to-bottom');
    taskItem.addEventListener('animationend', () => {
        taskItem.classList.remove('go-to-bottom');
    });

    checkBox.onclick = () => {
        if (checkBox.checked === true) {
            task.classList.add('checked');
            taskItem.classList.add('checked-animation');
            taskItem.addEventListener('animationend', function handleAnimationEnd() {
                taskItem.classList.remove('checked-animation');
                taskItem.removeEventListener('animationend', handleAnimationEnd);
                saveTasks(); 
            });
        } else {
            task.classList.remove('checked');
            saveTasks();
        }
    };

    task.onclick = () => {
        if (task.classList.contains('checked')) {
            task.classList.remove('checked');
            checkBox.checked = false;
        } else {
            task.classList.add('checked');
            taskItem.classList.add('checked-animation');
            taskItem.addEventListener('animationend', function handleAnimationEnd() {
                taskItem.classList.remove('checked-animation');
                taskItem.removeEventListener('animationend', handleAnimationEnd);
            });
            checkBox.checked = true;
        }
        saveTasks(); 
    };

    taskContainer.appendChild(taskItem);

    taskNameInput.value = "";

    pickTaskContainer.classList.add('go-top-animation');
    pickTaskContainer.addEventListener('animationend', function handleAnimationEnd() {
        pickTaskContainer.classList.remove('go-top-animation');
        pickTaskContainer.style.display = 'none';
        pickTaskContainer.removeEventListener('animationend', handleAnimationEnd);
    });

    saveTasks(); 
}

function toggleNotes(taskItem) {
    saveTasks()
    let noteContainer = taskItem.querySelector('.note-container');
    if (noteContainer.style.display === "none") {
        let restContainers = Array.from(document.getElementsByClassName("note-container"));
        restContainers.forEach(x => x.style.display = "none");
        noteContainer.classList.add('go-left-animation');
        noteContainer.addEventListener('animationend', function handleAnimationEnd() {
            noteContainer.classList.remove('go-left-animation');
            noteContainer.style.display = "flex";
            noteContainer.removeEventListener('animationend', handleAnimationEnd);
        });
        noteContainer.style.display = "flex";
    } else {
        noteContainer.classList.add('delete-animation');
        noteContainer.addEventListener('animationend', function handleAnimationEnd() {
            noteContainer.classList.remove('delete-animation');
            noteContainer.style.display = "none";
            noteContainer.removeEventListener('animationend', handleAnimationEnd);
        });
    }
    saveTasks(); 
}

function saveProjectName(name) {
    localStorage.setItem('projectName', name);
}

function loadProjectName() {
    const savedName = localStorage.getItem('projectName');
    if (savedName) {
        projectHeader.innerHTML = savedName;
    }
    checkSavedProjectName();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        const taskName = taskItem.querySelector('label').textContent;
        const isChecked = taskItem.querySelector('input[type="checkbox"]').checked;
        const note = taskItem.querySelector('.noteInput').value;
        tasks.push({ taskName, isChecked, note });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(taskData => {
            taskNameInput.value = taskData.taskName;
            addTask();
            const taskItem = document.querySelector('.task-item:last-child');
            taskItem.querySelector('input[type="checkbox"]').checked = taskData.isChecked;
            taskItem.querySelector('.noteInput').value = taskData.note;
            if (taskData.isChecked) {
                taskItem.querySelector('label').classList.add('checked');
            }
        });
    }
}

initializePage();
