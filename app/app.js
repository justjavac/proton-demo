const state = {
    count: 0,
    nextTaskId: 3,
    theme: "light",
    tasks: [
        { id: 1, title: "Create a Proton window", done: true },
        { id: 2, title: "Load HTML as an asset", done: false },
    ],
};

const elements = {
    count: document.getElementById("count"),
    taskCount: document.getElementById("taskCount"),
    doneCount: document.getElementById("doneCount"),
    clock: document.getElementById("clock"),
    log: document.getElementById("log"),
    tasks: document.getElementById("tasks"),
    taskInput: document.getElementById("taskInput"),
};

function addLog(message) {
    const line = document.createElement("div");
    line.textContent = new Date().toLocaleTimeString() + "  " + message;
    elements.log.prepend(line);
    while (elements.log.children.length > 10) {
        elements.log.removeChild(elements.log.lastElementChild);
    }
}

function renderStats() {
    elements.count.textContent = String(state.count);
    elements.taskCount.textContent = String(state.tasks.length);
    elements.doneCount.textContent = String(
        state.tasks.filter((task) => task.done).length,
    );
}

function renderTasks() {
    elements.tasks.innerHTML = "";
    if (state.tasks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "No tasks";
        elements.tasks.appendChild(empty);
        return;
    }

    for (const task of state.tasks) {
        const item = document.createElement("label");
        item.className = "task" + (task.done ? " done" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            addLog((task.done ? "Done: " : "Open: ") + task.title);
            render();
        });

        const title = document.createElement("span");
        title.textContent = task.title;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "danger";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => {
            state.tasks = state.tasks.filter((item) => item.id !== task.id);
            addLog("Removed: " + task.title);
            render();
        });

        item.append(checkbox, title, remove);
        elements.tasks.appendChild(item);
    }
}

function render() {
    document.documentElement.dataset.theme = state.theme;
    renderStats();
    renderTasks();
}

document.getElementById("tick").addEventListener("click", () => {
    state.count += 1;
    addLog("Count " + state.count);
    renderStats();
});

document.getElementById("theme").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    addLog("Theme " + state.theme);
    render();
});

document.getElementById("reset").addEventListener("click", () => {
    state.count = 0;
    state.tasks = [];
    addLog("Reset");
    render();
});

document.getElementById("taskForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = elements.taskInput.value.trim();
    if (!title) {
        elements.taskInput.focus();
        return;
    }
    state.tasks.push({ id: state.nextTaskId, title, done: false });
    state.nextTaskId += 1;
    elements.taskInput.value = "";
    addLog("Added: " + title);
    render();
});

function updateClock() {
    elements.clock.textContent = new Date().toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);
addLog("Started");
render();
