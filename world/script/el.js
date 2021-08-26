//公共
let boxs = document.querySelectorAll(".box");
let rollBtn = document.getElementById("roll-btn");
let rollScreen = document.getElementById("roll-scr");
let billboard = document.getElementById("billboard");
let nextRoundBtn = document.getElementById("next-round-btn");

//玩者1
let p1El = document.getElementById("player1");
let p1BD = document.getElementById("bankDeposit1");
let p1OP = document.getElementById("player1operate");
let p1pop = document.getElementById("p1pop");
let p1popCBtn = document.getElementById("p1popCloseBtn");

//玩者2
let p2El = document.getElementById("player2");
let p2BD = document.getElementById("bankDeposit2");
let p2OP = document.getElementById("player2operate");
let p2pop = document.getElementById("p2pop");
let p2popCBtn = document.getElementById("p2popCloseBtn");

//玩者3
let p3El = document.getElementById("player3");
let p3BD = document.getElementById("bankDeposit3");
let p3OP = document.getElementById("player3operate");
let p3pop = document.getElementById("p3pop");
let p3popCBtn = document.getElementById("p3popCloseBtn");


let arr = [];
//循环生成正确地图顺序
for (let i = 0; i < boxs.length; i++) {
    let a = boxs[i];
    a.addEventListener("click", function () {
        if(this.getAttribute("selected") === "true"){
            this.setAttribute("selected", "false");
        }else{
            this.setAttribute("selected", "true");
        }
        
    });
    let j = a.getAttribute("value") - 1;
    arr[j] = a;
}

//弹出框相关

let closeBtn = document.querySelectorAll(".closeBtn");

for (let i = 0; i < closeBtn.length; i++) {
    closeBtn[i].addEventListener("click", function () {
        let pop = this.parentNode.parentNode.parentNode;
        pop.style.display = "none";
    });
}

p1OP.addEventListener("click", function () {
    p1pop.removeAttribute('style');
});

p2OP.addEventListener("click", function () {
    p2pop.removeAttribute('style');
});

p3OP.addEventListener("click", function () {
    p3pop.removeAttribute('style');
});