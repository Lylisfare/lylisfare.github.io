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
let rollPoint = 0;

initGame();

nextRoundBtn.addEventListener("click", function () {
    if (!gameover) {
        gameLoop();

    } else {
        gameReset();
        setTimeout(loop, 1000);
    }
    nextRoundBtn.setAttribute("disabled","disabled");
    rollBtn.removeAttribute("disabled");

});

rollBtn.addEventListener("click", function(){
    let val = Math.round(Math.random() * 6)
    if (!val) val = 1;
    rollScreen.value = val;
    rollPoint = val;
    nextRoundBtn.removeAttribute("disabled");
    rollBtn.setAttribute("disabled","disabled");
});