let boxs = document.querySelectorAll(".box");
let rollBtn = document.getElementById("roll-btn");
let rollScreen = document.getElementById("roll-scr");
let billboard = document.getElementById("billboard");
let p1El = document.getElementById("player1");
let p2El = document.getElementById("player2");
let p3El = document.getElementById("player3");
let p1BD = document.getElementById("bankDeposit1");
let p2BD = document.getElementById("bankDeposit2");
let p3BD = document.getElementById("bankDeposit3");
let p1OP = document.getElementById("player1operate");
let p2OP = document.getElementById("player2operate");
let p3OP = document.getElementById("player3operate");
let arr = [];

for (let i = 0; i < boxs.length; i++) {
    let a = boxs[i];
    let j = a.getAttribute("value") - 1;
    arr[j] = a;
}

let queue = [
    { name: "张三", el: p1El, now: 0, nowEl: arr[0], bankDeposit: p1BD, pauseRound: 0, bankruptcy: false, operate: p1OP, },
    { name: "李四", el: p2El, now: 0, nowEl: arr[0], bankDeposit: p2BD, pauseRound: 0, bankruptcy: false, operate: p2OP, },
    { name: "王五", el: p3El, now: 0, nowEl: arr[0], bankDeposit: p3BD, pauseRound: 0, bankruptcy: false, operate: p3OP, },
];

let p1 = queue[0];
let p2 = queue[1];
let p3 = queue[2];


initGame();


let gameover = false;   //是否已经结束游戏
let time = 0;           //触发事件次数
let bankruptcy = 0;     //破产人数
let pNow = p1;          //正在操作玩者


rollBtn.addEventListener("click", function () {
    if (!gameover) {
        gameLoop();

    } else {
        gameReset();
        setTimeout(loop, 1000);
    }

});



function gameReset() {
    initGame();

    gameover = false;   //是否已经结束游戏
    time = 0;           //触发事件次数
    bankruptcy = 0;     //破产人数
    pNow = p1;          //正在操作玩者
    rollBtn.innerText = "点击投掷";
    billboard.innerHTML = `<div class="messageMainTitle">公共触发事件</div>`;
    rollScreen.value = 0;
}

function initGame() {
    resetPlayer(p1);
    resetPlayer(p2);
    resetPlayer(p3);

    p1.next = p2;
    p1.prev = p3;
    p2.next = p3;
    p2.prev = p1;
    p3.next = p1;
    p3.prev = p2;
}

function go(p, pos) {
    p.now = 0;
    p.nowEl = arr[pos];
    p.nowEl.appendChild(p.el);
}

function resetPlayer(p) {
    go(p, 0);
    p.bankruptcy = false;
    p.pauseRound = 0;
    p.bankDeposit.value = 100000;
}



function gameLoop() {

    //当前回合事件
    let val = Math.round(Math.random() * 6)
    if (!val) val = 1;
    rollScreen.value = val;

    pNow.now += val;
    if (pNow.now < arr.length) {
        pNow.nowEl = arr[pNow.now];
    } else {
        pNow.now -= arr.length;
        pNow.nowEl = arr[pNow.now];
    }

    if (pNow.nowEl.getAttribute("area") === "event") {
        triggerEvent(pNow, pNow.now + 1);

        pNow.nowEl.appendChild(pNow.el);

    } else {
        pNow.nowEl.appendChild(pNow.el);
    }

    pNow.operate.setAttribute("disabled","disabled");
    
    //设置下一位
    pNow = run(pNow.next);

    function run(p){
        if(p.pauseRound > 0) {
            p.pauseRound -= 1;
            return run(p.next);
        }else{
            return p;
        }
    }


    /* if (pNow.next.pauseRound > 0) {
        pNow.next.pauseRound--;
        pNow = pNow.next.next;
        if(pNow.pauseRound > 0){
            pNow.pauseRound--;
            pNow = pNow.next;
        }
    }else{
        pNow = pNow.next;
    } */
    pNow.operate.removeAttribute("disabled");
}



function triggerEvent(pNow, num) {
    let str = "";
    let { name, bankDeposit } = pNow;

    switch (num) {
        case 6:
            (() => {
                let forwNum = Math.round(Math.random() * 6);
                let goNum = num + forwNum - 1;
                if (goNum >= arr.length) goNum -= arr.length;

                go(pNow, goNum);
                str = `前进 ${forwNum} 格`;
            })();
            break;
        case 10: str = "到此一游";
            break;

        case 14:
            (() => {
                let cost = Math.round(Math.random() * 10000);
                bankDeposit.value = +bankDeposit.value - cost;
                str = `参加公益活动，消费 ${cost} 元`

                if (bankDeposit.value < 0) {
                    pNow.bankruptcy = true;
                    bankDeposit.value = " 破产";
                    bankruptcy += 1;
                    pNow.next.prev = pNow.prev;
                    pNow.prev.next = pNow.next;
                }

            })();
            break;
        case 21:
            (() => {
                let backNum = Math.round(Math.random() * 6);
                let goNum = num - backNum - 1;
                if (goNum < 0) goNum += arr.length;

                go(pNow, goNum);
                str = `后退 ${backNum} 格`;
            })();
            break;
        case 23:
            (() => {
                go(pNow, 0);
                str = `返回起点`;
            })();
            break;
        case 19:
            (() => {
                let pauseRound = Math.round(Math.random() * 6);
                pNow.pauseRound = pauseRound;
                str = `免费住宿，暂停 ${pauseRound} 回合`;
            })();
            break;

        case 28:
            (() => {
                let cash = Math.round(Math.random() * 10000);
                bankDeposit.value = +bankDeposit.value + cash;
                str = `捡到现金 ${cash} 元`;
            })();
            break;

        case 32:
            (() => {
                let cost = Math.round(Math.random() * 10000);
                bankDeposit.value = +bankDeposit.value - cost;
                str = `参加公益活动，消费 ${cost} 元`

                if (bankDeposit.value < 0) {
                    pNow.bankruptcy = true;
                    bankDeposit.value = " 破产";
                    bankruptcy += 1;
                    pNow.next.prev = pNow.prev;
                    pNow.prev.next = pNow.next;
                }

            })();
            break;
    }


    if (bankruptcy === 2) {
        let winner;
        gameover = true;
        for (let i = 0; i < queue.length; i++) {
            if (!queue[i].bankruptcy) winner = queue[i];
        }

        rollBtn.innerText = "重置游戏";
        billboard.innerHTML = `<div>${time++}：胜利者是：${winner.name}</div>` + billboard.innerHTML;
    } else {
        billboard.innerHTML = `<div>${time++}：${name} ${str}</div>` + billboard.innerHTML;

    }

}
loop();
function loop() {
    if (!gameover) {
        rollBtn.click();
        setTimeout(loop, 20);
    }
}