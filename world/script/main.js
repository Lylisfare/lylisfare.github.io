let queue = [
    { name: "张三", el: p1El, now: 0, nowEl: arr[0], bankDeposit: p1BD, pauseRound: 0, bankruptcy: false, operate: p1OP, },
    { name: "李四", el: p2El, now: 0, nowEl: arr[0], bankDeposit: p2BD, pauseRound: 0, bankruptcy: false, operate: p2OP, },
    { name: "王五", el: p3El, now: 0, nowEl: arr[0], bankDeposit: p3BD, pauseRound: 0, bankruptcy: false, operate: p3OP, },
];

let p1 = queue[0];
let p2 = queue[1];
let p3 = queue[2];

let gameover = false;   //是否已经结束游戏
let time = 0;           //触发事件次数
let bankruptcy = 0;     //破产人数
let pNow = p1;          //正在操作玩者
let round = 0;

initGame();

rollBtn.addEventListener("click", function () {
    if (!gameover) {
        gameLoop();

    } else {
        gameReset();
        setTimeout(loop, 1000);
    }

});