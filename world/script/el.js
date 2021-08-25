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