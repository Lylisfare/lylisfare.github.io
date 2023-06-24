LIGHT.addEvent("click", function () {
    STATUS.light = this.checked;
    if (this.checked) {
        CANVAS.style.backgroundColor = "#ffffff";
    } else {
        CANVAS.style.backgroundColor = "#000000";
    }
});
BUILD.addEvent("click", function () {
    buildSprite();
});
CHANGE_TITLE.addEvent("click", function () {
    const title = prompt("输入标题名称", STATUS.title);
    if (title) {
        STATUS.title = `${title}`;
        TITLE_CONTENT.innerText = STATUS.title;
    }
});
QUEUE_LIST_PICKER.addEvent("click", function () {
    if (!this.checked) {
        QUEUE_LIST_CONTAINER.removeChild(QUEUE_LIST_CONTENT);
    } else {
        QUEUE_LIST_CONTAINER.insertBefore(QUEUE_LIST_CONTENT, QUEUE_LIST_CONTAINER.children[0]);
    }
});
FRAME_LIST_PICKER.addEvent("click", function () {
    if (!this.checked) {
        FRAME_LIST_CONTAINER.removeChild(FRAME_LIST_CONTENT);
    } else {
        FRAME_LIST_CONTAINER.appendChild(FRAME_LIST_CONTENT);
    }
});
PLAY_QUEUE.addEvent("click", function () {
    if (this.value === "▶") {
        this.value = "||";
        STATUS.playing = true;
        this.setAttribute("title", "停止播放帧");
        Timer.reset();
        STATUS.playSettings.frame_now = 0;
        CTX.clearRect(0, 0, 512, 512);

    } else if (this.value === "||") {
        this.value = "▶";
        STATUS.playing = false;
        this.setAttribute("title", "播放帧");
        Timer.reset();
        STATUS.playSettings.frame_now = 0;
    }
});
IMPORT.addEvent("click", function () {
    importData(function (data) {
        const iData = JSON.parse(decodeURI(atob(data)));
        if (+iData.version === .1) {
            const { layers } = iData
            const queue = {
                id: `q${+QUEUE_LIST.length}-${+new Date()}`,
                count: 0,
                frame_now: 0,
                pos: +QUEUE_LIST.length,
                name: `序列 ${STATUS.count++}`,
                frames: [
                    {
                        id: `f${0}-${+new Date()}`,
                        count: 0,
                        layer_now: 0,
                        pos: 0,
                        name: `第 ${0} 帧`,
                        layers: layers,
                    }
                ],
            }
            createQueue(queue);
        } else if (+iData.version === .2) {
            const { queues, title } = iData;
            if (title) {
                STATUS.title = `${title}`;
                TITLE_CONTENT.innerText = STATUS.title;
            }
            for (let queue of queues) {
                createQueue(queue);
            }
        }
    });
});
EXPORT.addEvent("click", function () {
    const exportObject = btoa(encodeURI(JSON.stringify({ queues: QUEUE_LIST, version: VERSION, title: STATUS.title })));
    exportData(exportObject, "pp", ((STATUS.title) ? STATUS.title : "未命名"));
});
FLIP.addEvent("click", function () {
    STATUS.flip_draw = this.checked;
});
KEEP.addEvent("click", function () {
    STATUS.keepDraw = this.checked;
});
PEN.addEvent("click", function () {
    if (this.checked) {
        STATUS.tool = "pen";
    }
});
ERASER.addEvent("click", function () {
    if (this.checked) {
        STATUS.tool = "eraser";
    }
});
COLOR.addEvent("change", function () {
    STATUS.color = this.value;
});
NEW_QUEUE.addEvent("click", function () {
    if (QUEUE_LIST_PICKER.value === "▶") {
        QUEUE_LIST_CONTAINER.appendChild(QUEUE_LIST_CONTENT);
        QUEUE_LIST_PICKER.value = "◀";
        QUEUE_LIST_PICKER.title = "隐藏";
    }
    createQueue();
});
CANVAS.addEvent("mouseout", function () {
    STATUS.drawing = false
});
CANVAS.addEvent("mousemove", function ({ offsetX, offsetY }) {
    if (STATUS.drawing) {
        drawPixel(offsetX, offsetY);
    }
});
CANVAS.addEvent("mouseup", function () {
    if (STATUS.keepDraw) {
        STATUS.drawing = false;
    }
});
CANVAS.addEvent("mousedown", function ({ offsetX, offsetY, button }) {
    if (button === 0) {
        drawPixel(offsetX, offsetY);
    }
});
FLIP_HORZON.addEvent("change", function () {
    if (this.checked) {
        STATUS.flip_direction = "horizon";
    }
});
FLIP_VERTICAL.addEvent("change", function () {
    if (this.checked) {
        STATUS.flip_direction = "vertical";
    }
});
FLIP_CENTER.addEvent("change", function () {
    if (this.checked) {
        STATUS.flip_direction = "center";
    }
});
UNDO.addEvent("click", function () {

    

});
REDO.addEvent("click", function () {

    
});