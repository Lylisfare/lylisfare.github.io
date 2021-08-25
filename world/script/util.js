//实用工具

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

function consume(p, c) {
    let cost = +p.bankDeposit.value - c;
    if (cost < 0) {
        p.bankDeposit.value = "破产";
        p.bankruptcy = true;
        bankruptcy += 1;
        p.prev.next = p.next;
        p.next.prev = p.prev;
        return true;
    } else {
        p.bankDeposit.value = cost;
        return false;
    }
}