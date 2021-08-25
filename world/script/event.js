//事件
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
                str = `跃迁，前进 ${forwNum} 格`;
            })();
            break;
        case 10: str = "到此一游";
            break;

        case 14:
            (() => {
                let cost = Math.round(Math.random() * 10000);
                let res = consume(pNow, cost);
                str = `参加公益活动，消费 ${cost} 元`;
                if(res) str += "，破产" 
            })();
            break;
        case 21:
            (() => {
                let backNum = Math.round(Math.random() * 6);
                let goNum = num - backNum - 1;
                if (goNum < 0) goNum += arr.length;

                go(pNow, goNum);
                str = `回溯，后退 ${backNum} 格`;
            })();
            break;
        case 23:
            (() => {
                go(pNow, 0);
                str = `重开，返回起点`;
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
        default: str = `前进至 ${num} 格`;
            break;
    }


    let dl = "";

    if (!p1.bankruptcy && name === p1.name) {
        dl = `<div>------------------- 第 ${round} 回合 -----------------</div>`;
        round++;
    } else if ((p1.bankruptcy || p1.pauseRound > 0) && !p2.bankruptcy && name === p2.name) {
        dl = `<div>------------------- 第 ${round} 回合 -----------------</div>`;
        round++;
    }

    billboard.innerHTML = `<div>${time++}：${name} ${str}</div>${dl}` + billboard.innerHTML;
    

    if (bankruptcy === 2) {
        let winner;
        gameover = true;
        for (let i = 0; i < queue.length; i++) {
            if (!queue[i].bankruptcy) {
                winner = queue[i];
                break;
            }
        }

        rollBtn.innerText = "重置游戏";
        billboard.innerHTML = `<div>${time++}：胜利者是：${winner.name}</div>` + billboard.innerHTML;
    }

}