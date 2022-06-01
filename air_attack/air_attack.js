const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buffer = new OffscreenCanvas(300, 500);
const bctx = buffer.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const bubble_alert = document.getElementById("bubble-alert");
const end_point = document.getElementById("end-point");

function addCount() {
    console.log()
    let value = +scoreboard.value;
    scoreboard.value = value + 1;
}
function resetCount() {
    scoreboard.value = 0;
}

function showEnd(value) {
    bubble_alert.setAttribute("hide", false);
    end_point.value = value;
}

function hideEnd() {
    bubble_alert.setAttribute("hide", true);
    end_point.value = "";
}

const area = new Rect(0, 0, 300, 500);
const air = createEntity(1001, 150, 440, 10, 0, 0);
let stoped = true;

let map = []
let count = 0;
let old = new Date();
let interval = 300;
let flag;
let flag2;

const MAX_ENEMY_COUNT = 10;

function createEnemy(i) {
    let enemySize = randomNum(10, 20);
    let x = randomNum(20, 260);
    let id = `${randomNum()}`;
    let spd = randomNum(1, 4);
    let enemy = createEntity(id, x, 1, enemySize, 0, spd);
    map.push(enemy);
}

function updateMap() {
    if (map.length < MAX_ENEMY_COUNT) {
        createEnemy();
    } else {
        for (let i = 0; i < map.length; i++) {
            let enemy = map[i];
            if (!area.collision(enemy.shape)) enemy.pos.y = enemy.shape.radius;
        }
    }
}

function checkMap() {
    for (let i = 0; i < map.length; i++) {
        let enemy = map[i];
        air.collision(enemy);
        if (enemy.hurt) addCount();
        if (enemy.shape.collision(air.shape)) {
            showEnd(scoreboard.value);
            stop();
        }
        if (enemy.hurt) map.splice(i, 1);
    }
}



const V = 3

const EVENTS = new Map([
    [UP_KEY, function () {
        if (air.pos.y - air.shape.radius > area.y)
            air.pos.y -= V;
    }],
    [DOWN_KEY, function () {
        if (air.pos.y + air.shape.radius < area.y + area.h)
            air.pos.y += V;
    }],
    [LEFT_KEY, function () {
        if (air.pos.x - air.shape.radius > area.x)
            air.pos.x -= V;
    }],
    [RIGHT_KEY, function () {
        if (air.pos.x + air.shape.radius < area.x + area.w)
            air.pos.x += V;
    }],
    [SHOT_KEY, function () {
        let now = new Date();
        let pass = now - old;
        count += pass;
        if (count > interval) {
            air.shot();
            count = 0;
        }

        old = now;
    }]
]);

document.addEventListener("keydown", function ({ keyCode }) {
    if (keyCode === 13) {
        stop();
        start();
    }
})

function start() {
    hideEnd();
    stoped = false;

    air.pos.x = 150;
    air.pos.y = 440;
    map.length = 0;
    count = 0;
    old = new Date();
    interval = 300;

    loop2();
    loop();
}

function stop() {
    stoped = true;
    keyReset();
    cancelAnimationFrame(flag);
    clearTimeout(flag2);
    air.resetWeapon();
    air.pos.x = 150;
    air.pos.y = 440;
    map.length = 0;
    count = 0;
    old = new Date();
    interval = 300;
    resetCount();
}

function loop2() {
    flag2 = setTimeout(loop2, 16.7)
    update();
}

function loop() {
    flag = requestAnimationFrame(loop);
    process();
    render();
}

function process() {
    if (KEY_MAP.get(UP_KEY)) EVENTS.get(UP_KEY)();
    if (KEY_MAP.get(DOWN_KEY)) EVENTS.get(DOWN_KEY)();
    if (KEY_MAP.get(LEFT_KEY)) EVENTS.get(LEFT_KEY)();
    if (KEY_MAP.get(RIGHT_KEY)) EVENTS.get(RIGHT_KEY)();
    if (KEY_MAP.get(SHOT_KEY)) EVENTS.get(SHOT_KEY)();
}

function update() {
    updateMap();

    for (let i = 0; i < map.length; i++) {
        let enemy = map[i];
        enemy.update();
    }
    if (air) air.update(area);


    checkMap();
}
bctx.lineWidth = 1.5;
function render() {
    bctx.clearRect(0, 0, 300, 500);
    if (!stoped) {

        for (let i = 0; i < map.length; i++) {
            let enemy = map[i];
            enemy.render(bctx, "#ff00ff");
        }
        if (air) air.render(bctx);


    }
    ctx.clearRect(0, 0, 300, 500);
    ctx.drawImage(buffer, 0, 0, 300, 500);

}