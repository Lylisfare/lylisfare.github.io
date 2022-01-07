const canvas = document.getElementById("no-music-canvas");
const ctx = canvas.getContext("2d");
const pointPanel = document.getElementById("point");
let gameFlag = null;

class Rect {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    render() {
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    collision(game_status) {
        let t1 = this.y;
        let b1 = this.y + this.h;

        let t2 = 600;
        let b2 = 610;

        if (b1 > t2 && t1 < b2) {
            if (!game_status.rect_in) {
                game_status.rect_in = true;
            }
            return true;
        }

        if (t1 > b2 && b1 < t2) {
            if (!game_status.rect_in) {
                game_status.rect_in = true;
            }
            return true;
        }
        return false;
    }
}

function game() {
    let renderFlag = null;
    let updateFlag = null;
    let point = 0;

    let rs = {
        1: null,
        2: null,
        3: null,
        4: null,
    }

    let end = 100;
    let now = 0;
    let nowCol = 1;

    const cols = [
        [], [], [], []
    ]

    const game_status = {
        1: { rect_in: false },
        2: { rect_in: false },
        3: { rect_in: false },
        4: { rect_in: false }
    }

    const colRectConfig = [
        { x: 25, w: 60 },
        { x: 95, w: 60 },
        { x: 165, w: 60 },
        { x: 235, w: 60 }
    ];
    const checkRectConfig = { x: 0, y: 600, w: 320, h: 10 }


    const checkRect = new Rect(checkRectConfig.x, checkRectConfig.y, checkRectConfig.w, checkRectConfig.h);

    function createRect(colRectConfig) {
        let h = Math.round(Math.random() * 150 + 10);
        let b = Math.round(Math.random() * 150 + 10);
        return new Rect(colRectConfig.x, -h, colRectConfig.w, h)
    }

    function renderCol(col) {
        for (let i = 0; i < col.length; i++) {
            col[i].render();
        }
    }

    function checkCol(col) {
        if (!col.length) {
            return true;
        }
        if (col[0].y > 10) {
            return true;
        }

        if (col.length > 0 && col[col.length - 1].y > 640) {
            col.length = col.length - 1;
        }
        return false;
    }

    function checkAllCol() {
        let resCount = 0;
        for (let i = 0; i < cols.length; i++) {

            if (checkCol(cols[i])) resCount += 1;
        }

        if (now < end && resCount === 4) {
            let coln = Math.round(Math.random() * 3)
            let col = cols[coln];
            col.unshift(createRect(colRectConfig[coln]));
            now += 1;
        }
    }


    function updateCol(col, n) {
        game_status[n].rect_in = false;
        rs[n] = null;
        for (let i = 0; i < col.length; i++) {
            col[i].y += 2;
            if (col[i].collision(game_status[n])) {
                rs[n] = col[i];
            }
        }
    }

    let key_status = {
        q: false,
        w: false,
        e: false,
        r: false
    }

    let key_map = new Map([
        [81, "q"],
        [87, "w"],
        [69, "e"],
        [82, "r"]
    ]);

    document.addEventListener("keydown", function ({ keyCode }) {
        if (key_map.has(keyCode)) {
            let key = key_map.get(keyCode);
            key_status[key] = true;
        }
    });

    document.addEventListener("keyup", function ({ keyCode }) {
        if (key_map.has(keyCode)) {
            let key = key_map.get(keyCode);
            key_status[key] = false;
        }
    });

    update(function () {
        checkAllCol();

        updateCol(cols[0], 1);
        updateCol(cols[1], 2);
        updateCol(cols[2], 3);
        updateCol(cols[3], 4);
        checkEnd();
    });


    render(function () {
        ctx.fillStyle = "#0099FF";
        renderCol(cols[0]);
        ctx.fillStyle = "#CC3399";
        renderCol(cols[1]);
        ctx.fillStyle = "#66CC66";
        renderCol(cols[2]);
        ctx.fillStyle = "#CC6633";
        renderCol(cols[3]);


        if (rs[1] && key_status.q && game_status[1].rect_in) {
            point += 1;
            ctx.fillStyle = "#000000";
            rs[1].render();
        }

        if (rs[2] && key_status.w && game_status[2].rect_in) {
            point += 1;
            ctx.fillStyle = "#000000";
            rs[2].render();
        }
        if (rs[3] && key_status.e && game_status[3].rect_in) {
            point += 1;
            ctx.fillStyle = "#000000";
            rs[3].render();
        }
        if (rs[4] && key_status.r && game_status[4].rect_in) {
            point += 1;
            ctx.fillStyle = "#000000";
            rs[4].render();
        }
        ctx.fillStyle = "#FFFF33";
        checkRect.render();
        pointPanel.innerHTML = point;
    });
    function update(callback) {
        callback();
        updateFlag = setInterval(callback, 17);
    }

    function render(callback) {
        ctx.clearRect(0, 0, 320, 640);
        callback();
        renderFlag = requestAnimationFrame(() => {
            render(callback);
        });
    }

    function gameEnd() {
        clearInterval(updateFlag);
        cancelAnimationFrame(renderFlag);
        ctx.clearRect(0, 0, 320, 640);
        gameFlag = null;
    }

    function checkEnd() {
        if (now >= end) {
            let res = 0; 
            for (let i = 0; i < cols.length; i++) {
                let res2 = 0;
                for(let j=0;j<cols[i].length;j++){
                    let r = cols[i][j];
                    if(r.y > 640){
                        res2 += 1;
                    }
                }
                if (res2 === cols[i].length) {
                    res += 1;
                }
            }
            
            if (res === 4) {
                gameEnd();
            }
        }
    }

    return gameEnd;
}



function start() {
    stop();
    pointPanel.innerHTML = 0;
    if (!gameFlag) {
        gameFlag = game();
    }
}

function stop() {
    if (gameFlag) {
        gameFlag();
    }
}
