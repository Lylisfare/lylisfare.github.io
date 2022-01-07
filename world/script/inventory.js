function Pop(content = []) {

    const mainbox = document.createElement("div");
    mainbox.setAttribute("class", "pop");
    mainbox.setAttribute("style", "display:none;");

    const container = document.createElement("div");
    container.setAttribute("class", "popMain");

    for (let i = 0; i < content.length; i++) {
        container.appendChild(content[i]);
    }

    mainbox.appendChild(container);

    this.show = function () {
        mainbox.removeAttribute("style");
    }
    this.hide = function () {
        mainbox.setAttribute("style", "display:none;");
    }
}

function Inventory() {
    const header = document.createElement("div");
}


const player = {
    name: "zhang san",
    male: "0",
    attr:{
        str:10,
        con:10,
    },
    skill: [
        { name: "攻击", action: "" },
        { name: "防御", action: "" },
        { name: "回避", action: "" },
        { name: "逃跑", action: "" }
    ]

}

