//主画布
const CANVAS = document.getElementById("canvas");
const CTX = CANVAS.getContext("2d");
//调色盘
const PALETTE = document.getElementById("palette");
//图层
const LAYER_LIST = document.getElementById("layer_list");
const NEW_LAYER = document.getElementById("new_layer");
//颜色
const COLOR = document.getElementById("color");
//工具
const PEN = document.getElementById("pen");
const ERASER = document.getElementById("eraser");
const UNDO = document.getElementById("undo");
const REDO = document.getElementById("redo");
const FLIP = document.getElementById("flip_canvas");
const IMPORT = document.getElementById("import");
const EXPORT = document.getElementById("export");

const LAYERS = []; //[{ show: true, items: [] }]
const HISTORY = [];
const REDO_LIST = [];
const FLIP_LAYERS = [];
const VERSION = .1;
const STATUS = {
    layer_now: 0,
    color: "#000",
    tool: "pen",
    pixelSize: 4,
    flip_draw: false,
    count: 0,
};

IMPORT.addEventListener("click", function () {
    importData(function (data) {
        const { layers, version } = JSON.parse(decodeURI(atob(data)));

        for (const layer of layers) {
            createLayer(layer);
        }
    });
});

EXPORT.addEventListener("click", function () {
    const exportObject = btoa(encodeURI(JSON.stringify({ layers: LAYERS, version: VERSION })));
    exportData(exportObject, "pp");
});



FLIP.addEventListener("click", function () {
    STATUS.flip_draw = this.checked;
});

UNDO.addEventListener("click", function () {
    if (HISTORY.length > 0) {
        const active = HISTORY.pop();

        if (active.operate === "draw") {
            STATUS.layer_now = +active.layer;
            LAYERS[STATUS.layer_now].items.pop();
            REDO_LIST.push(active);

        } else if (active.operate === "clean") {
            STATUS.layer_now = +active.layer;
            LAYERS[STATUS.layer_now].items.push({
                x: +active.item.x,
                y: +active.item.y,
                size: +active.item.size,
                color: `${active.item.color}`,
            });
            REDO_LIST.push(active);
        }
    }

    //console.log(HISTORY, REDO_LIST);
});

REDO.addEventListener("click", function () {
    if (REDO_LIST.length > 0) {
        const active = REDO_LIST.pop();

        if (active.operate === "draw") {
            STATUS.layer_now = +active.layer;
            LAYERS[STATUS.layer_now].items.push({
                x: +active.item.x,
                y: +active.item.y,
                size: +active.item.size,
                color: `${active.item.color}`,
            });
            HISTORY.push(active);


        } else if (active.operate === "clean") {
            STATUS.layer_now = +active.layer;
            LAYERS[STATUS.layer_now].items.pop();
            HISTORY.push(active);
        }
    }

    //console.log(HISTORY, REDO_LIST);
});


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


CANVAS.addEventListener("mousedown", function ({ offsetX, offsetY, button }) {
    if (button === 0) {
        if (LAYERS.length > 0) {
            const item = getPosition(offsetX, offsetY);
            const i = find(item)
            if (STATUS.tool === "pen") {
                if (i || i === 0) LAYERS[STATUS.layer_now].items.splice(i, 1);
                item.color = `${STATUS.color}`;
                item.size = +STATUS.pixelSize;
                LAYERS[STATUS.layer_now].items.push(item);

                if (STATUS.flip_draw) {
                    const j = find({ x: (256 - item.x) + (256 - STATUS.pixelSize), y: +item.y });

                    if (j || j === 0) LAYERS[STATUS.layer_now].items.splice(j, 1);

                    LAYERS[STATUS.layer_now].items.push({
                        x: (256 - item.x) + (256 - STATUS.pixelSize),
                        y: +item.y,
                        size: +item.size,
                        color: `${item.color}`,
                        flip_draw: true,
                    });

                }

                HISTORY.push({
                    operate: "draw",
                    layer: +STATUS.layer_now,
                    flip_draw: false,
                    item: {
                        x: +item.x,
                        y: +item.y,
                        size: +item.size,
                        color: `${item.color}`,
                    }
                });
                REDO_LIST.length = 0;
            } else if (STATUS.tool === "eraser") {
                if (i || i === 0) {
                    const ritem = LAYERS[STATUS.layer_now].items.splice(i, 1)[0];

                    if (STATUS.flip_draw) {
                        const j = find({ x: (256 - item.x) + (256 - STATUS.pixelSize), y: +item.y });
                        if (j || j === 0) {
                            const fitem = LAYERS[STATUS.layer_now].items.splice(j, 1)[0];

                            HISTORY.push({
                                operate: "clean",
                                layer: +STATUS.layer_now,
                                flip_draw: ((fitem.flip_draw) ? true : false),
                                item: {
                                    x: +fitem.x,
                                    y: +fitem.y,
                                    size: +fitem.size,
                                    color: `${fitem.color}`,
                                }
                            });
                        }
                    }

                    HISTORY.push({
                        operate: "clean",
                        layer: +STATUS.layer_now,
                        flip_draw: ((ritem.flip_draw) ? true : false),
                        item: {
                            x: +ritem.x,
                            y: +ritem.y,
                            size: +ritem.size,
                            color: `${ritem.color}`,
                        }
                    });


                }
                REDO_LIST.length = 0;
            }
        } else {
            alert("没有可用图层");
        }
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
    initPalette();
    loop();
});

function render() {
    CTX.clearRect(0, 0, 512, 512);
    if (STATUS.flip_draw) {
        CTX.fillStyle = "#00000011";
        CTX.fillRect(256, 0, 256, 512);
    }
    for (const layer of FLIP_LAYERS) {
        if (layer.show) {
            for (const point of layer.items) {
                draw(point);
            }
        }
    }
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

function createLayer(layer) {
    const pos = LAYERS.length;
    const c = STATUS.count++;
    const LAYER = (layer) ? layer : { show: true, items: [], pos: +pos, name: `图层 ${c}` };
    LAYERS[pos] = LAYER;
    const li = document.createElement("li");
    const btn = document.createElement("input");
    const nameNode = document.createTextNode(LAYER.name);
    btn.setAttribute("class", "layer_btn");
    btn.setAttribute("type", "radio");//<input value="0"></input>
    btn.setAttribute("name", "layer_now");

    li.setAttribute("id", `layer_${pos}`);
    btn.setAttribute("value", pos);

    btn.addEventListener("change", function () {
        if (this.checked) {
            STATUS.layer_now = LAYER.pos;
        }
    });

    const rename = document.createElement("input");
    rename.setAttribute("type", "button");
    rename.setAttribute("class", "layer_btn");
    rename.setAttribute("value", "🖊");
    rename.setAttribute("title", "重命名");
    rename.addEventListener("click", function () {
        const name = prompt("输入名称", LAYER.name);
        console.log(name.length);
        if (name.length <= 8) {
            nameNode.textContent = name;
            LAYER.name = name;
        } else {
            alert("图层名称不能超过8个字符");
        }
    });


    const move_up = document.createElement("input");
    move_up.setAttribute("type", "button");
    move_up.setAttribute("class", "layer_btn");
    move_up.setAttribute("value", "🔼");
    move_up.setAttribute("title", "上移");

    move_up.addEventListener("click", function () {
        const prev = LAYERS[LAYER.pos - 1];
        if (prev) {
            const posi = +LAYER.pos;
            if (STATUS.layer_now === posi) {
                STATUS.layer_now = posi - 1;
            }
            LAYERS[posi - 1] = LAYER;
            LAYERS[posi] = prev;
            prev.pos = +posi;
            LAYER.pos = posi - 1;
            const prevLi = LAYER_LIST.childNodes[LAYER.pos];
            LAYER_LIST.insertBefore(li, prevLi);
        }
    });


    const move_down = document.createElement("input");
    move_down.setAttribute("type", "button");
    move_down.setAttribute("class", "layer_btn");
    move_down.setAttribute("value", "🔽");
    move_down.setAttribute("title", "下移");
    move_down.addEventListener("click", function () {
        const next = LAYERS[LAYER.pos + 1];
        if (next) {
            const posi = +LAYER.pos;
            if (STATUS.layer_now === posi) {
                STATUS.layer_now = posi + 1;
            }
            LAYERS[posi + 1] = LAYER;
            LAYERS[posi] = next;
            next.pos = +posi;
            LAYER.pos = posi + 1;
            const nextLi = LAYER_LIST.childNodes[LAYER.pos];
            LAYER_LIST.insertBefore(nextLi, li);
        }
    });

    const hide = document.createElement("input");
    hide.setAttribute("type", "checkbox");
    hide.addEventListener("change", function () {
        LAYERS[pos].show = this.checked;
    });

    const remove = document.createElement("input");
    remove.setAttribute("type", "button");
    remove.setAttribute("class", "layer_btn");
    remove.setAttribute("value", "❌");
    remove.setAttribute("title", "删除");
    remove.addEventListener("click", function () {
        const check = confirm("是否确认删除图层，删除后无法恢复，请谨慎操作。");
        if (check) {
            const prev = LAYERS[LAYER.pos - 1];
            const next = LAYERS[LAYER.pos + 1];
            LAYERS.splice(LAYER.pos, 1);
            LAYER_LIST.removeChild(li);
            if (next) {
                next.pos = LAYER.pos;
            }
            if (STATUS.layer_now === LAYER.pos) {
                if (next) {
                    next.checkBtn.click();
                } else if (prev) {
                    prev.checkBtn.click();
                } else {
                    STATUS.layer_now = 0;
                }
            }
        }

    });

    li.appendChild(btn);
    li.appendChild(nameNode);
    li.appendChild(hide);
    li.appendChild(rename);
    li.appendChild(move_up);
    li.appendChild(move_down);
    li.appendChild(remove);
    LAYER_LIST.appendChild(li);
    hide.click();
    LAYER.checkBtn = btn;

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

function initPalette() {
    for (let i = 0; i < 72; i++) {
        PALETTE.appendChild(createPaletteColor(i, PALETTE_COLORS[i]));
    }
}

function createPaletteColor(i, color) {
    const item = document.createElement("div");
    item.setAttribute("id", `color_${i}`);
    item.setAttribute("value", `${color}`);
    item.setAttribute("style", `background-color: ${color};`);
    item.addEventListener("click", function () {
        COLOR.value = color;
        STATUS.color = color;
    });
    return item;
}