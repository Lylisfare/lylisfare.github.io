let queue = [
    new Charactor("张三", "player1", p1BD, p1OP),
    new Charactor("李四", "player2", p2BD, p2OP),
    new Charactor("王五", "player3", p3BD, p3OP),
];

let p1 = queue[0];
let p2 = queue[1];
let p3 = queue[2];
p1.setNext(p2);
p2.setNext(p3);
p3.setNext(p1);

let gameover = false;   //是否已经结束游戏
let time = 0;           //触发事件次数
let bankruptcy = 0;     //破产人数
let pNow = p1;          //正在操作玩者
let eventNumber = false;
let round = 0;
let rollPoint = 0;
let moveX = false;
let moveY = false;

/* initGame(); */
let gameMap = new GameMap();
gameMap.init(11, 11);
gameMap.moveOver(p1, 0, 0);
gameMap.moveOver(p2, 0, 0);
gameMap.moveOver(p3, 0, 0);
gameMap.render();
roundPlayer.value = pNow.name;




rollBtn.addEventListener("click", function () {
    let val = Math.round(Math.random() * 6)
    if (!val) val = 1;
    rollScreen.value = val;
    rollPoint = val;
    gameMap.focusMapAreaFromStartPosition(pNow.x, pNow.y, rollPoint);
    rollBtn.setAttribute("disabled", "disabled");
    moveBtn.removeAttribute("disabled");
});


moveBtn.addEventListener("click", function () {
    if (moveX !== false && moveY !== false) {
        gameMap.moveOver(pNow, moveX, moveY);
        if (eventNumber !== false) {
            triggerEvent(pNow, eventNumber);
        }

    }
    moveX = false;
    moveY = false;
    eventNumber = false
    gameMap.remarkMapBoxAll();
    moveBtn.setAttribute("disabled", "disabled");
    nextRoundBtn.removeAttribute("disabled");
});

nextRoundBtn.addEventListener("click", function () {
    if (!gameover) {
        pNow.operateBtn.setAttribute("disabled", "disabled");
        rollPoint = 0;

        //设置下一位
        pNow = run(pNow.next);

        function run(p) {
            if (p.pauseRound > 0) {
                p.pauseRound -= 1;
                return run(p.next);
            } else {
                return p;
            }
        }

        pNow.operateBtn.removeAttribute("disabled");

        pNow = pNow.next;
        roundPlayer.value = pNow.name;
        rollScreen.value = 0;
        nextRoundBtn.setAttribute("disabled", "disabled");
        rollBtn.removeAttribute("disabled");
    }
    /* if (!gameover) {
        gameLoop();

    } else {
        gameReset();
        setTimeout(loop, 1000);
    } */

});
