const CANVAS = document.getElementById("canvas");
const CTX = CANVAS.getContext("2d");
const LAYERS = [];
const SIZE = document.getElementById("size");
//{ show: true, items: [] }
const STATUS = {
    layer_now: 0,
    color: "#000",
    tool: "pen",
    pixelSize: 4,
};

const LAYER_LIST = document.getElementById("layer_list");
const NEW_LAYER = document.getElementById("new_layer");

const COLOR = document.getElementById("color");

const PEN = document.getElementById("pen");
const ERASER = document.getElementById("eraser")

SIZE.addEventListener("change", function () {
    const value = +this.value;

    if (!isNaN(value) && value !== 0) {
        STATUS.pixelSize = value;
    }
})


PEN.addEventListener("click", function () {
    if (this.checked) {
        STATUS.tool = "pen";
    }
});

ERASER.addEventListener("click", function () {
    if (this.checked) {
        STATUS.tool = "eraser";
    }
});


COLOR.addEventListener("change", function () {
    STATUS.color = this.value;
})

NEW_LAYER.addEventListener("click", function () {
    createLayer();
});


CANVAS.addEventListener("mousedown", function ({ offsetX, offsetY }) {
    if (LAYERS.length > 0) {
        const item = getPosition(offsetX, offsetY);
        const i = find(item)
        if (STATUS.tool === "pen") {
            if (i || i === 0) LAYERS[STATUS.layer_now].items.splice(i, 1);
            item.color = `${STATUS.color}`;
            item.size = +STATUS.pixelSize;
            LAYERS[STATUS.layer_now].items.push(item);
        } else if (STATUS.tool === "eraser") {
            if (i || i === 0) LAYERS[STATUS.layer_now].items.splice(i, 1);
        }
    } else {
        alert("没有可用图层");
    }
});


function find({ x, y }) {
    for (let i = 0; i < LAYERS[STATUS.layer_now].items.length; i++) {
        const item = LAYERS[STATUS.layer_now].items[i];
        if (item.x === x && item.y === y) {
            return i;
        }
    }
}

window.addEventListener("load", function () {
    loop();
});

function render() {
    CTX.clearRect(0, 0, 512, 512);
    for (const layer of LAYERS) {
        if (layer.show) {
            for (const point of layer.items) {
                draw(point);
            }
        }
    }
}

function loop() {
    requestAnimationFrame(loop);
    render();
}

function createLayer() {
    const pos = LAYERS.length
    LAYERS[pos] = { show: true, items: [] };
    const li = document.createElement("li");
    const btn = document.createElement("input");
    li.setAttribute("id", `layer_${pos}`);
    btn.setAttribute("class", "layer_btn");
    btn.setAttribute("type", "radio");//<input value="0"></input>
    btn.setAttribute("name", "layer_now");
    btn.setAttribute("value", pos);

    btn.addEventListener("change", function () {
        if (this.checked) {
            STATUS.layer_now = pos;
        }
    });

    const hide = document.createElement("input");
    hide.setAttribute("type", "checkbox");
    hide.addEventListener("change", function () {
        LAYERS[pos].show = this.checked;
    });

    const remove = document.createElement("input");
    remove.setAttribute("type", "button");
    remove.setAttribute("class", "btn");
    remove.setAttribute("value", "x");


    li.appendChild(btn);
    li.appendChild(document.createTextNode(`图层 ${pos}`));
    li.appendChild(hide);
    li.appendChild(remove);
    LAYER_LIST.appendChild(li);
    hide.click();

    if (LAYERS.length === 1) {
        btn.click();
    }
}

function setColor(color = "#f00") {
    CTX.fillStyle = color;
}

function draw({ x = 0, y = 0, size = 4, color = "#f00" }) {

    setColor(color);

    CTX.fillRect(x, y, size, size);
}

function getPosition(x = 0, y = 0) {
    return { x: x - (x % STATUS.pixelSize), y: y - (y % STATUS.pixelSize) }
}