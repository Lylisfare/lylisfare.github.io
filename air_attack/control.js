const UP_KEY = 87;
const DOWN_KEY = 83;
const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const SHOT_KEY = 74;

const KEY_MAP = new Map([
    [UP_KEY, false],
    [DOWN_KEY, false],
    [LEFT_KEY, false],
    [RIGHT_KEY, false],
    [SHOT_KEY, false]
]);

function keyReset(){
    KEY_MAP.set(UP_KEY, false);
    KEY_MAP.set(DOWN_KEY, false);
    KEY_MAP.set(LEFT_KEY, false);
    KEY_MAP.set(RIGHT_KEY, false);
    KEY_MAP.set(SHOT_KEY, false);
}

function keyDown({ keyCode }) {
    if (KEY_MAP.has(keyCode)) {
        KEY_MAP.set(keyCode, true);
    }
}

function keyUp({ keyCode }) {
    if (KEY_MAP.has(keyCode)) {
        KEY_MAP.set(keyCode, false);
    }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);