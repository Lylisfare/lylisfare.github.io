const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const buffer = new OffscreenCanvas(300, 500);
const bctx = buffer.getContext("2d");

const area = new Rect(0, 0, 300, 500);
const air = createEntity(1001, 150, 440, 16, 0, 0);
let stoped = true;

let map = []
let count = 0;
let old = new Date();
let interval = 300;
let flag;

const MAX_ENEMY_COUNT = 10;

function createEnemy(i) {
    let [x, y] = randomVec2(20, 20, 280, 280);
    let enemySize = randomNum(10, 20);
    let id = `${randomNum()}`;
    let spd = randomNum(1, 3);
    let enemy = createEntity(id, x, y - 100, enemySize, 0, spd);
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
        if (enemy.shape.collision(air.shape)) {
            stop();
        }
        if (enemy.hurt) map.splice(i, 1);
    }
}



const V = 3

const EVENTS = new Map([
    [UP_KEY, function () {
        air.pos.y -= V;
    }],
    [DOWN_KEY, function () {
        air.pos.y += V;
    }],
    [LEFT_KEY, function () {
        air.pos.x -= V;
    }],
    [RIGHT_KEY, function () {
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

function start() {
    stoped = false;

    air.pos.x = 150;
    air.pos.y = 440;
    map.length = 0;
    count = 0;
    old = new Date();
    interval = 300;

    loop();
}

function stop() {
    alert("GAME OVER");
    stoped = true;
    keyReset();
    cancelAnimationFrame(flag);
    //ctx.clearRect(0, 0, 300, 500);
    //bctx.clearRect(0, 0, 300, 500);
    air.pos.x = 150;
    air.pos.y = 440;
    map.length = 0;
    count = 0;
    old = new Date();
    interval = 300;
}


function loop() {
    flag = requestAnimationFrame(loop);
    process();
    update();
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
