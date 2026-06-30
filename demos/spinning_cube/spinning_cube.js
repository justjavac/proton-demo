const state = {
    rx: -24,
    ry: 36,
    rz: 0,
    speed: 45,
    paused: false,
    axes: { x: false, y: true, z: false },
    theme: "light",
    dragging: false,
    lastX: 0,
    lastY: 0,
};

const elements = {
    stage: document.getElementById("stage"),
    cube: document.getElementById("cube"),
    speed: document.getElementById("speed"),
    speedValue: document.getElementById("speedValue"),
    pause: document.getElementById("pause"),
};

function normalize(deg) {
    deg %= 360;
    return deg < 0 ? deg + 360 : deg;
}

function applyTransform() {
    elements.cube.style.transform =
        "rotateX(" + state.rx + "deg) rotateY(" + state.ry + "deg) rotateZ(" + state.rz + "deg)";
}

let lastTime = null;

function frame(time) {
    if (lastTime === null) {
        lastTime = time;
    }
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    if (!state.paused && !state.dragging) {
        const step = state.speed * dt;
        if (state.axes.x) {
            state.rx = normalize(state.rx + step);
        }
        if (state.axes.y) {
            state.ry = normalize(state.ry + step);
        }
        if (state.axes.z) {
            state.rz = normalize(state.rz + step);
        }
        applyTransform();
    }
    requestAnimationFrame(frame);
}

elements.stage.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    elements.stage.classList.add("dragging");
    elements.stage.setPointerCapture(event.pointerId);
});

elements.stage.addEventListener("pointermove", (event) => {
    if (!state.dragging) {
        return;
    }
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.ry = normalize(state.ry + dx * 0.5);
    state.rx = normalize(state.rx - dy * 0.5);
    applyTransform();
});

function endDrag() {
    state.dragging = false;
    elements.stage.classList.remove("dragging");
}

elements.stage.addEventListener("pointerup", endDrag);
elements.stage.addEventListener("pointercancel", endDrag);

elements.speed.addEventListener("input", () => {
    state.speed = Number(elements.speed.value);
    elements.speedValue.textContent = state.speed + "°/s";
});

document.getElementById("axes").addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) {
        return;
    }
    const axis = chip.dataset.axis;
    state.axes[axis] = !state.axes[axis];
    chip.classList.toggle("active", state.axes[axis]);
});

elements.pause.addEventListener("click", () => {
    state.paused = !state.paused;
    elements.pause.textContent = state.paused ? "Resume" : "Pause";
});

document.getElementById("reset").addEventListener("click", () => {
    state.rx = -24;
    state.ry = 36;
    state.rz = 0;
    applyTransform();
});

document.getElementById("theme").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = state.theme;
});

applyTransform();
requestAnimationFrame(frame);
