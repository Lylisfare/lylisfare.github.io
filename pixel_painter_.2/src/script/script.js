const QUEUE_LIST = [];
const VERSION = .2;

const STATUS = {
    title: "",
    color: "#000",
    tool: "pen",
    pixelSize: 4,
    flip_draw: false,
    flip_direction: "horizon",//vertical center
    light: true,
    count: 0,
    playing: false,
    playSettings: {
        frame_now: 0,
        timeStep: 500,
    },
    queues: QUEUE_LIST,
    keepDraw: true,
    drawing: false,
    now: {
        queue_now: 0,   //当前序列
        frame_now: 0,   //当前帧
        layer_now: 0,   //当前图层
    }
};

const Timer = new TimeSteper(STATUS.playSettings.timeStep);


window.addEventListener("load", function () {
    QUEUE_LIST_PICKER.click();
    FRAME_LIST_PICKER.click();
    LIGHT.click();
    initPalette();
    loop();
});

function renderLayer(ctx, Frame) {

    const Layers = Frame.layers;

    if (!Layers) return;
    if (!Layers.length) return;
    for (const layer of Layers) {

        if (!layer.show) continue;

        for (const point of layer.items) {
            draw(ctx, point);
        }

    }


}

function renderFrame(Queue, renderData) {
    if (renderData.Frame) {
        if (renderData.Frame.show) {
            CTX.clearRect(0, 0, 512, 512);
            renderLayer(CTX, renderData.Frame);

        } else {
            renderData.nowFramePos = renderData.nowFramePos + 1;
            renderData.Frame = Queue.frames[renderData.nowFramePos];
            renderFrame(Queue, renderData);
        }
    }
}

function render() {

    if (STATUS.playing) {
        if (Timer.step()) {

            const Queue = QUEUE_LIST[STATUS.now.queue_now];
            if (Queue) {

                const renderData = {
                    Frame: Queue.frames[STATUS.playSettings.frame_now],
                    nowFramePos: STATUS.playSettings.frame_now,
                }

                renderFrame(Queue, renderData)

                const nextFramePos = renderData.nowFramePos + 1;

                if (nextFramePos >= Queue.frames.length) {
                    STATUS.playSettings.frame_now = 0;
                } else {
                    STATUS.playSettings.frame_now = nextFramePos;
                }
            }
        }
        return;
    }


    CTX.clearRect(0, 0, 512, 512);

    if (STATUS.flip_draw) {
        CTX.fillStyle = (!STATUS.light) ? "#ffffff33" : "#00000033";
        if (STATUS.flip_direction === "horizon") {
            CTX.fillRect(256, 0, 256, 512);
        }
        else if (STATUS.flip_direction === "vertical") {

            CTX.fillRect(0, 256, 512, 256);
        }
        else if (STATUS.flip_direction === "center") {
            CTX.fillRect(0, 0, 256, 256);
            CTX.fillRect(256, 256, 256, 256);
        }
    }

    const Queue = QUEUE_LIST[STATUS.now.queue_now];
    if (Queue) {
        const nowFramePos = STATUS.now.frame_now;

        const Frame = Queue.frames[nowFramePos];

        if (Frame) renderLayer(CTX, Frame);
    }

}

function loop() {
    requestAnimationFrame(loop);
    render();
}

function getNowLayer({ queue_now, frame_now, layer_now }) {
    const Queue = QUEUE_LIST[queue_now];
    if (!Queue) {
        alert("没有可用序列");
        return;
    }
    const Frame = Queue.frames[frame_now];
    if (!Frame) {
        alert("没有可用帧");
        return;
    }

    const Layer = Frame.layers[layer_now];
    if (!Layer) {
        alert("没有可用图层");
        return;
    }

    return Layer;
}

function drawPixel(offsetX, offsetY) {


    if (STATUS.keepDraw) {
        STATUS.drawing = true;
    }

    if (STATUS.tool === "pen") {
        pen(STATUS.now, offsetX, offsetY,);

    } else if (STATUS.tool === "eraser") {
        eraser(STATUS.now, offsetX, offsetY);

    }
}

function pen({ queue_now, frame_now, layer_now }, x, y) {
    const Layer = getNowLayer({ queue_now, frame_now, layer_now });

    if (!Layer) return;

    const item = getPosition(x, y);
    const i = find(Layer, item);

    if (i || i === 0) Layer.items.splice(i, 1);
    const pitem = createPixel(item.x, item.y, STATUS.pixelSize, STATUS.color, false)

    Layer.items.push(pitem);


    if (STATUS.flip_draw) {
        const j = find(Layer, item, true);

        if (j || j === 0) Layer.items.splice(j, 1);

        const fpitem = createPixel(item.x, item.y, STATUS.pixelSize, STATUS.color, true)

        Layer.items.push(fpitem);
    }
}

function eraser({ queue_now, frame_now, layer_now }, x, y) {
    const Layer = getNowLayer({ queue_now, frame_now, layer_now });

    if (!Layer) return;

    const item = getPosition(x, y);
    const i = find(Layer, item);
    if (i || i === 0) {
        Layer.items.splice(i, 1)[0];


        if (STATUS.flip_draw) {
            const j = find(Layer, item, true);
            if (j || j === 0) {
                Layer.items.splice(j, 1)[0];
            }
        }
    }
}




//绘图专用
function createPixel(x = 0, y = 0, size = 4, color = "#333", flip_draw = false) {
    if (flip_draw) {
        if (STATUS.flip_direction === "horizon") {
            x = (256 - x) + (256 - STATUS.pixelSize);
        }
        else if (STATUS.flip_direction === "vertical") {
            y = (256 - y) + (256 - STATUS.pixelSize);
        }
        else if (STATUS.flip_direction === "center") {
            x = (256 - x) + (256 - STATUS.pixelSize);
            y = (256 - y) + (256 - STATUS.pixelSize);
        }
    }
    return {
        x: +x,
        y: +y,
        size: +size,
        color: `${color}`,
        flip_draw: (flip_draw) ? true : false,
        flip_direction: `${STATUS.flip_direction}`
    }
}

function find(layer = [], { x, y }, flip_draw = false) {

    if (flip_draw) {
        if (STATUS.flip_direction === "horizon") {
            x = (256 - x) + (256 - STATUS.pixelSize);
        }
        else if (STATUS.flip_direction === "vertical") {
            y = (256 - y) + (256 - STATUS.pixelSize);
        }
        else if (STATUS.flip_direction === "center") {
            x = (256 - x) + (256 - STATUS.pixelSize);
            y = (256 - y) + (256 - STATUS.pixelSize);
        }
    }

    for (let i = 0; i < layer.items.length; i++) {
        const item = layer.items[i];
        if (item.x === x && item.y === y) {
            return i;
        }
    }
}

function setColor(ctx, color = "#f00") {
    ctx.fillStyle = color;
}

function draw(ctx, { x = 0, y = 0, size = 4, color = "#f00" }) {

    setColor(ctx, color);

    ctx.fillRect(x, y, size, size);
}

function getPosition(x = 0, y = 0) {
    return { x: x - (x % STATUS.pixelSize), y: y - (y % STATUS.pixelSize) }
}

function initPalette() {
    for (let i = 0; i < PALETTE_COLORS.length; i++) {
        PALETTE.appendChild(createPaletteColor(i, PALETTE_COLORS[i]));
    }
}

function createPaletteColor(i, color) {
    const item = createElement("div", {
        "id": `color_${i}`,
        "value": `${color}`,
        "style": `background-color: ${color};`,
        "title": `${color}`,
    });
    item.addEvent("click", function () {
        COLOR.value = color;
        STATUS.color = color;
    });
    return item;
}