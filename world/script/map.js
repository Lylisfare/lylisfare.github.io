function Game() {
    let round = 0;
    this.chars = [];
    this.addChar = function (char) {
        this.chars.push(char);
    }
}

function prevBro(el, func) {
    let prev = el.previousElementSibling;
    if (prev) {
        func(prev);
        prevBro(prev, func);
    }
}
function nextBro(el, func) {
    let next = el.nextElementSibling;
    if (next) {
        func(next);
        nextBro(next, func)
    }
}


function Box(x, y, value, terrain, area, event) {
    this.el = document.createElement("div");
    this.el.setAttribute("class", "box");
    this.el.setAttribute("value", value);
    this.el.setAttribute("terrain", terrain);
    this.el.setAttribute("area", area);
    this.el.setAttribute("event", event);
    this.el.setAttribute("focus", false);
    this.el.setAttribute("x", x);
    this.el.setAttribute("y", y);
    this.el.addEventListener("click", function () {
        if (this.getAttribute("focus") === "true") {
            if (this.getAttribute("selected") === "true") {
                this.setAttribute("selected", "false");
                moveX = false;
                moveY = false;
                eventNumber = false;
            } else {
                this.setAttribute("selected", "true");
                moveX = +this.getAttribute("x");
                moveY = +this.getAttribute("y");
                eventNumber = +this.getAttribute("value");
                prevBro(this, function (el) {
                    el.setAttribute("selected", "false");
                });
                nextBro(this, function (el) {
                    el.setAttribute("selected", "false");
                });
            }
        }
    });
    this.x = x;
    this.y = y;
    this.north = null;
    this.east = null;
    this.south = null;
    this.west = null;
    this.mark = false;
    this.setEast = function (box) {
        this.east = box;
        box.west = this;
    }
    this.setWest = function (box) {
        this.west = box;
        box.east = this;
    }
    this.setNorth = function (box) {
        this.north = box;
        box.south = this;
    }
    this.setSouth = function (box) {
        this.south = box;
        box.north = this;
    }
    this.moveOver = function (char) {
        char.x = this.x;
        char.y = this.y;
        this.el.appendChild(char.el);
    }
    this.focus = function () {
        this.el.setAttribute("focus", true);
    }
    this.unfocus = function () {
        this.el.setAttribute("focus", false);
    }
    this.unselect = function(){
        this.el.setAttribute("selected", false);
    }
    return this;
}

function GameMap() {
    const terrainType = ["wall", "lake", "land", "forest"];
    const eventList = [];
    let container = document.createElement("div");
    let map = [];

    this.init = function (x, y) {
        let k = 0;
        for (let i = 0; i < x; i++) {
            map[i] = [];

            for (let j = 0; j < y; j++) {
                let rtt = Math.round(Math.random() * 3);
                let box = new Box(i, j, k++, terrainType[rtt], "event", "公益");
                map[i][j] = box;
                container.appendChild(box.el);
            }
        }

        this.initMapNet();
    }

    this.focusMapAreaFromStartPosition = function (x, y, maxStep) {
        let start = map[x][y];
        let step = 1;
        let directions = ["south", "east", "north", "west"];

        stepLoop(start, step);

        function stepLoop(start, nowStep) {
            start.focus();
            for (let i = 0; i < directions.length; i++) {
                let dir = directions[i];
                let box = start[dir];

                if (box && !box.mark) {
                    box.focus();

                    if (nowStep < maxStep) {
                        stepLoop(box, nowStep + 1);
                    }
                }
            }
        }
    }
    this.remarkMapBoxAll = function () {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map.length; j++) {
                this.unfocusMapBox(i, j);
            }
        }
    }

    this.initMapNet = function () {
        let m, n, a, b, c;

        for (let i = 0, l = 1; i < map.length; i++, l++) {
            m = map[i];
            n = map[l];
            for (let j = 0, k = 1; j < m.length; j++, k++) {
                a = m[j];
                b = m[k];

                if (b) a.setNorth(b);

                if (n) {
                    c = n[j];
                    if (c) a.setEast(c);
                }
            }
        }
    }
    this.render = function render() {
        let mainMap = document.getElementById("main-map");
        mainMap.appendChild(container);
    }
    this.moveOver = function (char, x = 0, y = 0) {
        map[x][y].moveOver(char);
    }
    this.focusMapBox = function (x, y) {
        map[x][y].focus();
    }
    this.unfocusMapBox = function (x, y) {
        map[x][y].unfocus();
        map[x][y].unselect();
    }
    return this;
}

function Charactor(name, pic, bankDeposit, operateBtn) {
    this.el = document.createElement("div");
    this.el.setAttribute("class", "player");
    this.el.setAttribute("name", name);
    this.el.setAttribute("playerImage", pic);
    this.name = name;
    this.bankDeposit = bankDeposit;
    this.operateBtn = operateBtn;
    this.pauseRound = 0;
    this.bankruptcy = false;
    this.x = 0;
    this.y = 0;
    this.maxMoveRange = 0;  //最大移动范围
    this.maxAttackRange = 0;//最大攻击范围
    this.cards = [];    //道具卡
    this.stocks = [];   //股票
    this.estate = [];   //地产
    this.prev = null;
    this.next = null;
    this.setPrev = function (char) {
        char.next = this;
        this.prev = char;
    }
    this.setNext = function (char) {
        this.next = char;
        char.prev = this;
    }
    return this;
}