const state = {
    nextId: 4,
    filter: "all",
    theme: "light",
    todos: [
        { id: 1, title: "Try the Proton todo demo", done: true },
        { id: 2, title: "Add a new task below", done: false },
        { id: 3, title: "Toggle a task done", done: false },
    ],
};

const elements = {
    summary: document.getElementById("summary"),
    todos: document.getElementById("todos"),
    input: document.getElementById("todoInput"),
    filters: document.getElementById("filters"),
};

function visibleTodos() {
    if (state.filter === "active") {
        return state.todos.filter((todo) => !todo.done);
    }
    if (state.filter === "done") {
        return state.todos.filter((todo) => todo.done);
    }
    return state.todos;
}

function renderSummary() {
    const open = state.todos.filter((todo) => !todo.done).length;
    const done = state.todos.length - open;
    elements.summary.textContent = open + " open · " + done + " done";
}

function renderTodos() {
    const todos = visibleTodos();
    elements.todos.innerHTML = "";
    if (todos.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent =
            state.todos.length === 0 ? "No tasks yet" : "Nothing here";
        elements.todos.appendChild(empty);
        return;
    }

    for (const todo of todos) {
        const item = document.createElement("label");
        item.className = "todo" + (todo.done ? " done" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.addEventListener("change", () => {
            todo.done = checkbox.checked;
            render();
        });

        const title = document.createElement("span");
        title.textContent = todo.title;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "danger";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => {
            state.todos = state.todos.filter((entry) => entry.id !== todo.id);
            render();
        });

        item.append(checkbox, title, remove);
        elements.todos.appendChild(item);
    }
}

function renderFilters() {
    for (const chip of elements.filters.querySelectorAll(".chip")) {
        chip.classList.toggle(
            "active",
            chip.dataset.filter === state.filter,
        );
    }
}

function render() {
    document.documentElement.dataset.theme = state.theme;
    renderSummary();
    renderFilters();
    renderTodos();
}

document.getElementById("todoForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = elements.input.value.trim();
    if (!title) {
        elements.input.focus();
        return;
    }
    state.todos.push({ id: state.nextId, title, done: false });
    state.nextId += 1;
    elements.input.value = "";
    render();
});

elements.filters.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) {
        return;
    }
    state.filter = chip.dataset.filter;
    render();
});

document.getElementById("clearDone").addEventListener("click", () => {
    state.todos = state.todos.filter((todo) => !todo.done);
    render();
});

document.getElementById("theme").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    render();
});

render();
