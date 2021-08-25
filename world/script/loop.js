//主循环
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

    pNow.operate.setAttribute("disabled", "disabled");

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

    pNow.operate.removeAttribute("disabled");
}