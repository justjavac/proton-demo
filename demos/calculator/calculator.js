const state = {
    entry: "0",
    previous: null,
    op: null,
    waiting: false,
    theme: "light",
};

const elements = {
    expr: document.getElementById("expr"),
    entry: document.getElementById("entry"),
};

const OP_SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return "Error";
    }
    const rounded = Math.round(value * 1e10) / 1e10;
    return String(rounded);
}

function applyOp(left, op, right) {
    switch (op) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            return right === 0 ? NaN : left / right;
        default:
            return right;
    }
}

function inputDigit(digit) {
    if (state.entry === "Error" || state.waiting) {
        state.entry = digit;
        state.waiting = false;
    } else if (state.entry === "0") {
        state.entry = digit;
    } else if (state.entry.replace(/[-.]/g, "").length < 12) {
        state.entry += digit;
    }
}

function inputDecimal() {
    if (state.entry === "Error" || state.waiting) {
        state.entry = "0.";
        state.waiting = false;
    } else if (!state.entry.includes(".")) {
        state.entry += ".";
    }
}

function chooseOp(op) {
    if (state.entry === "Error") {
        return;
    }
    const current = parseFloat(state.entry);
    if (state.op && !state.waiting) {
        const result = applyOp(state.previous, state.op, current);
        state.previous = result;
        state.entry = formatNumber(result);
    } else {
        state.previous = current;
    }
    state.op = op;
    state.waiting = true;
}

function equals() {
    if (state.entry === "Error" || state.op === null || state.waiting) {
        return;
    }
    const result = applyOp(state.previous, state.op, parseFloat(state.entry));
    elements.expr.textContent =
        formatNumber(state.previous) +
        " " +
        OP_SYMBOLS[state.op] +
        " " +
        state.entry +
        " =";
    state.entry = formatNumber(result);
    state.previous = null;
    state.op = null;
    state.waiting = true;
}

function clearAll() {
    state.entry = "0";
    state.previous = null;
    state.op = null;
    state.waiting = false;
}

function negate() {
    if (state.entry === "Error" || state.entry === "0") {
        return;
    }
    state.entry = state.entry.startsWith("-")
        ? state.entry.slice(1)
        : "-" + state.entry;
}

function percent() {
    if (state.entry === "Error") {
        return;
    }
    state.entry = formatNumber(parseFloat(state.entry) / 100);
}

function backspace() {
    if (state.entry === "Error" || state.waiting) {
        return;
    }
    state.entry = state.entry.length > 1 ? state.entry.slice(0, -1) : "0";
    if (state.entry === "-") {
        state.entry = "0";
    }
}

function render() {
    document.documentElement.dataset.theme = state.theme;
    elements.entry.textContent = state.entry;
    if (state.op !== null) {
        elements.expr.textContent =
            formatNumber(state.previous) + " " + OP_SYMBOLS[state.op];
    }
    for (const button of document.querySelectorAll("button.op")) {
        button.classList.toggle(
            "active",
            state.waiting && button.dataset.op === state.op,
        );
    }
}

function renderExprClear() {
    elements.expr.innerHTML = "&nbsp;";
}

document.querySelector(".keys").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }
    if (button.dataset.digit !== undefined) {
        if (state.waiting) {
            renderExprClear();
        }
        inputDigit(button.dataset.digit);
    } else if (button.dataset.op !== undefined) {
        chooseOp(button.dataset.op);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearAll();
                renderExprClear();
                break;
            case "negate":
                negate();
                break;
            case "percent":
                percent();
                break;
            case "decimal":
                if (state.waiting) {
                    renderExprClear();
                }
                inputDecimal();
                break;
            case "equals":
                equals();
                break;
        }
    }
    render();
});

document.addEventListener("keydown", (event) => {
    if (event.key >= "0" && event.key <= "9") {
        if (state.waiting) {
            renderExprClear();
        }
        inputDigit(event.key);
    } else if (
        event.key === "+" ||
        event.key === "-" ||
        event.key === "*" ||
        event.key === "/"
    ) {
        chooseOp(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        equals();
    } else if (event.key === ".") {
        if (state.waiting) {
            renderExprClear();
        }
        inputDecimal();
    } else if (event.key === "%") {
        percent();
    } else if (event.key === "Escape") {
        clearAll();
        renderExprClear();
    } else if (event.key === "Backspace") {
        backspace();
    } else {
        return;
    }
    render();
});

document.getElementById("theme").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    render();
});

render();
