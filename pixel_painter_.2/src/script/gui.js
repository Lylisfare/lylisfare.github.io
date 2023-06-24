function createQueue(queueData) {
    const QUEUE = {};
    const QUEUE_DOMS = {};
    const QUEUE_STATUS = (queueData) ? queueData : {
        id: `q${+QUEUE_LIST.length}-${+new Date()}-${(Math.random() * 1000000).toFixed(0)}`,
        count: 0,
        frame_now: 0,
        frames: [],
        pos: +QUEUE_LIST.length,
        name: `序列 ${STATUS.count++}`
    };
    QUEUE.QUEUE_STATUS = QUEUE_STATUS;
    QUEUE.QUEUE_DOMS = QUEUE_DOMS;

    if (queueData) QUEUE_STATUS.id = `q${+QUEUE_LIST.length}-${+new Date()}-${(Math.random() * 1000000).toFixed(0)}`;

    QUEUE_LIST.push(QUEUE_STATUS);

    QUEUE_DOMS.queueTab = createElement("label", { "for": QUEUE_STATUS.id });
    QUEUE_DOMS.queueTabContent = createElement("div", {});
    QUEUE_DOMS.queueTabNameNode = createTextNode(QUEUE_STATUS.name);
    QUEUE_DOMS.queueNameContent = createElement("div", { "class": "queue_name_content" });

    QUEUE_DOMS.queueChecker = createElement("input",
        { "type": "radio", "name": "queue_list", "id": QUEUE_STATUS.id, },
        {
            "click": function () {
                if (this.checked) {
                    STATUS.now.queue_now = QUEUE_STATUS.pos;
                    STATUS.now.frame_now = QUEUE_STATUS.frame_now;
                    const Frame = QUEUE_STATUS.frames[QUEUE_STATUS.frame_now]
                    if (Frame) {
                        Frame.checkBtn.click();
                        STATUS.now.layer_now = Frame.layer_now;
                        const Layer = Frame.layers[Frame.layer_now];
                        if (Layer) {
                            Layer.checkBtn.click();
                        } else {
                            STATUS.now.layer_now = 0;
                        }

                    } else {
                        STATUS.now.layer_now = 0;
                    }
                    STATUS.now.queue_now = QUEUE_STATUS.pos;
                    clearChilds(FRAME_LIST_CONTENT);
                    appendChild(FRAME_LIST_CONTENT, [QUEUE_DOMS.queueFrameList]);
                }
            }
        }
    );

    QUEUE_DOMS.queueRemove = createElement("input",
        { "class": "list_btn", "type": "button", "value": "❌", "title": "删除序列" },
        {
            "click": function () {
                const check = confirm("是否确认删除序列，删除后无法恢复，请谨慎操作。");

                if (check) {
                    QUEUE_LIST_CONTENT.removeChild(QUEUE_DOMS.queueTab);

                    const prev = QUEUE_LIST[QUEUE_STATUS.pos - 1];
                    const next = QUEUE_LIST[QUEUE_STATUS.pos + 1];

                    QUEUE_LIST.splice(QUEUE_STATUS.pos, 1);

                    if (next) {
                        next.pos = QUEUE_STATUS.pos;
                    }

                    if (STATUS.now.queue_now === QUEUE_STATUS.pos) {
                        if (next) {
                            next.checkBtn.click();
                        } else if (prev) {
                            prev.checkBtn.click();
                        } else {
                            STATUS.now.queue_now = 0;
                        }
                    }
                }
            }
        }
    );

    QUEUE_DOMS.queueRename = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🖊", "title": "重命名", },
        {
            "click": function () {
                const name = prompt("输入名称", QUEUE_STATUS.name);
                if (name) {
                    if (name.length <= 8) {
                        QUEUE_DOMS.queueTabNameNode.textContent = name;
                        QUEUE_STATUS.name = name;
                    } else {
                        alert("图层名称不能超过8个字符");
                    }
                }
            }
        }
    );

    QUEUE_DOMS.queueMove_up = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🔼", "title": "上移", },
        {
            "click": function () {
                const posi = +QUEUE_STATUS.pos;
                const prev_pos = QUEUE_STATUS.pos - 1
                const prev = QUEUE_LIST[prev_pos];
                if (prev) {
                    const prevLi = QUEUE_LIST_CONTENT.children[prev_pos];

                    QUEUE_LIST_CONTENT.insertBefore(QUEUE_DOMS.queueTab, prevLi);

                    if (STATUS.now.queue_now === posi) {
                        STATUS.now.queue_now = prev_pos;
                    }

                    QUEUE_LIST[prev_pos] = QUEUE_STATUS;
                    QUEUE_LIST[posi] = prev;
                    prev.pos = +posi;
                    QUEUE_STATUS.pos = +prev_pos;
                }
            }
        }
    );

    QUEUE_DOMS.queueMove_down = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🔽", "title": "下移" },
        {
            "click": function () {
                const posi = +QUEUE_STATUS.pos;
                const next_pos = posi + 1;
                const next = QUEUE_LIST[next_pos];
                if (next) {
                    const nextLi = QUEUE_LIST_CONTENT.children[next_pos];

                    QUEUE_LIST_CONTENT.insertBefore(nextLi, QUEUE_DOMS.queueTab);

                    if (STATUS.now.queue_now === posi) {
                        STATUS.now.queue_now = next_pos;
                    }

                    QUEUE_LIST[next_pos] = QUEUE_STATUS;
                    QUEUE_LIST[posi] = next;
                    next.pos = +posi;
                    QUEUE_STATUS.pos = +next_pos;
                }
            }
        }
    );

    QUEUE_DOMS.queueCopyBtn = createElement("input",
        { "class": "list_btn", "type": "button", "value": "⛏", "title": "复制序列" },
        {
            "click": function () {
                const copy = JSON.parse(JSON.stringify(QUEUE_STATUS));
                const c = STATUS.count++;
                copy.pos = +QUEUE_LIST.length;
                copy.id = `q${c}-${+new Date()}`;

                for (let i = 0; i < copy.frames.length; i++) {
                    const frame = copy.frames[i];
                    frame.id = `f${i}-${+new Date()}`;

                    for (let j = 0; j < frame.layers.length; j++) {

                        const layer = frame.layers[i];
                        layer.id = `l${i}-${+new Date()}`;
                    }
                }

                copy.name = `序列 ${c}`;

                createQueue(copy);
            }
        }
    );

    QUEUE_DOMS.queueFrameList = createElement("ul");  //帧列表

    NEW_FRAME.addEvent("click", function () {
        createFrame(QUEUE);
    });

    appendChild(QUEUE_LIST_CONTENT, [
        appendChild(QUEUE_DOMS.queueTab, [
            QUEUE_DOMS.queueChecker,
            appendChild(QUEUE_DOMS.queueTabContent, [
                appendChild(QUEUE_DOMS.queueNameContent, [
                    QUEUE_DOMS.queueTabNameNode,
                    QUEUE_DOMS.queueCopyBtn,
                    QUEUE_DOMS.queueRename,
                    QUEUE_DOMS.queueMove_up,
                    QUEUE_DOMS.queueMove_down
                ]),
                QUEUE_DOMS.queueRemove
            ])
        ])
    ]);

    QUEUE_STATUS.checkBtn = QUEUE_DOMS.queueChecker;

    //数据导入
    if (queueData) {
        for (const frameData of queueData.frames) {
            if (frameData) frameData.id = `f${QUEUE_STATUS.frames.length}-${+new Date()}-${(Math.random() * 1000000).toFixed(0)}`
            createFrame(QUEUE, frameData);
        }
    }

    if (QUEUE_LIST.length === 1) {
        QUEUE_DOMS.queueChecker.click();
    }
}

function createFrame(QUEUE, frameData) {
    const { QUEUE_STATUS, QUEUE_DOMS } = QUEUE;
    const FRAME = {};
    const FRAME_DOMS = {};
    const FRAME_STATUS = (frameData) ? frameData : {
        id: `f${QUEUE_STATUS.count}-${+new Date()}-${(Math.random() * 1000000).toFixed(0)}`,
        show: true,
        count: 0,
        layer_now: 0,
        pos: +QUEUE_STATUS.frames.length,
        layers: [],
        name: `第 ${QUEUE_STATUS.count++} 帧`
    };
    FRAME.FRAME_STATUS = FRAME_STATUS;
    FRAME.FRAME_DOMS = FRAME_DOMS;
    if (!frameData) {
        QUEUE_STATUS.frames.push(FRAME_STATUS);
    }
    FRAME_DOMS.frameContent = createElement("li", {});
    FRAME_DOMS.frameHeader = createElement("label", { "for": FRAME_STATUS.id, "class": "frame_header" });
    FRAME_DOMS.frameHeaderContent = createElement("div", {});
    FRAME_DOMS.frameHeaderFrontContent = createElement("div", {});
    FRAME_DOMS.frameNameSpan = createElement("span", {});
    FRAME_DOMS.frameNameNode = createTextNode(FRAME_STATUS.name);
    FRAME_DOMS.frameOperateContent = createElement("div", {});

    FRAME_DOMS.frameChecker = createElement("input",
        { "id": FRAME_STATUS.id, "type": "radio", "name": `frame_list_${QUEUE_STATUS.id}` },
        {
            "change": function () {
                if (this.checked) {
                    if (FRAME_STATUS.layer_now === 0) {
                        if (FRAME_STATUS.layers[0]) {
                            QUEUE_STATUS.frame_now = FRAME_STATUS.pos;
                            STATUS.now.frame_now = FRAME_STATUS.pos;
                            STATUS.now.layer_now = 0;
                            FRAME_STATUS.layers[0].checkBtn.click();
                        }
                    } else {
                        if (FRAME_STATUS.layers[FRAME_STATUS.layer_now]) {
                            QUEUE_STATUS.frame_now = FRAME_STATUS.pos;
                            STATUS.now.frame_now = FRAME_STATUS.pos;
                            STATUS.now.layer_now = FRAME_STATUS.layer_now;
                            FRAME_STATUS.layers[FRAME_STATUS.layer_now].checkBtn.click();
                        }
                    }
                }
            }
        }
    );
    FRAME_DOMS.frameShowHide = createElement("input",
        { "type": "checkbox" },
        {
            "click": function () {
                FRAME_STATUS.show = this.checked;
            }
        }
    );
    FRAME_DOMS.frameNewLayerBtn = createElement("input",
        { "class": "list_btn", "type": "button", "value": "➕", "title": "新建图层" },
        {
            "click": function () {
                appendChild(FRAME_DOMS.frameContent, [FRAME_DOMS.frameLayerList]);
                createLayer(QUEUE, FRAME);
            }
        }
    );

    FRAME_DOMS.framePicker = createElement("input",
        { "class": "list_btn", "type": "button", "value": "▲", "title": "收起", },
        {
            "click": function () {
                if (this.value === "▲") {
                    this.value = "▼";
                    removeChild(FRAME_DOMS.frameContent, [FRAME_DOMS.frameLayerList]);
                } else if (this.value === "▼") {
                    this.value = "▲"
                    appendChild(FRAME_DOMS.frameContent, [FRAME_DOMS.frameLayerList]);
                }
            }
        }
    );

    FRAME_DOMS.frameCopyBtn = createElement("input",
        { "class": "list_btn", "type": "button", "value": "⛏", "title": "复制帧" },
        {
            "click": function () {
                QUEUE_STATUS.count++;
                const copy = JSON.parse(JSON.stringify(FRAME_STATUS));
                const c = QUEUE_STATUS.count;
                copy.pos = +QUEUE_STATUS.frames.length;
                copy.id = `f${c}-${+new Date()}`

                for (let i = 0; i < copy.layers.length; i++) {
                    const layer = copy.layers[i];
                    layer.id = `l${i}-${+new Date()}`;
                }

                copy.name = `第 ${c} 帧`
                QUEUE_STATUS.frames.push(copy);

                createFrame(QUEUE, copy);
            }
        }
    );

    FRAME_DOMS.frameRename = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🖊", "title": "重命名", },
        {
            "click": function () {
                const name = prompt("输入名称", FRAME_STATUS.name);
                if (name.length <= 8) {
                    FRAME_DOMS.frameNameNode.textContent = name;
                    FRAME_STATUS.name = name;
                } else {
                    alert("图层名称不能超过8个字符");
                }
            }
        }
    );

    FRAME_DOMS.frameMove_up = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🔼", "title": "上移", },
        {
            "click": function () {
                const posi = +FRAME_STATUS.pos;
                const prev_pos = FRAME_STATUS.pos - 1
                const prev = QUEUE_STATUS.frames[prev_pos];
                if (prev) {
                    const prevLi = QUEUE_DOMS.queueFrameList.childNodes[prev_pos];

                    QUEUE_DOMS.queueFrameList.insertBefore(FRAME_DOMS.frameContent, prevLi);

                    if (QUEUE_STATUS.frame_now === posi) {
                        QUEUE_STATUS.frame_now = +prev_pos;
                        STATUS.now.frame_now = +prev_pos;
                    }

                    QUEUE_STATUS.frames[prev_pos] = FRAME_STATUS;
                    QUEUE_STATUS.frames[posi] = prev;
                    prev.pos = +posi;
                    FRAME_STATUS.pos = +prev_pos;
                }
            }
        }
    );

    FRAME_DOMS.frameMove_down = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🔽", "title": "下移" },
        {
            "click": function () {
                const posi = +FRAME_STATUS.pos;
                const next_pos = FRAME_STATUS.pos + 1;
                const next = QUEUE_STATUS.frames[next_pos];
                if (next) {
                    const nextLi = QUEUE_DOMS.queueFrameList.childNodes[next_pos];

                    QUEUE_DOMS.queueFrameList.insertBefore(nextLi, FRAME_DOMS.frameContent);

                    if (QUEUE_STATUS.frame_now === posi) {
                        QUEUE_STATUS.frame_now = +next_pos;
                        STATUS.now.frame_now = next_pos
                    }

                    QUEUE_STATUS.frames[next_pos] = FRAME_STATUS;
                    QUEUE_STATUS.frames[posi] = next;
                    next.pos = +posi;
                    FRAME_STATUS.pos = +next_pos;
                }
            }
        }
    );

    FRAME_DOMS.frameRemove = createElement("input",
        { "class": "list_btn", "type": "button", "value": "❌", "title": "删除", },
        {
            "click": function () {
                const check = confirm("是否确认删除帧，删除后无法恢复，请谨慎操作。");

                if (check) {
                    QUEUE_DOMS.queueFrameList.removeChild(FRAME_DOMS.frameContent);

                    const prev = QUEUE_STATUS.frames[FRAME_STATUS.pos - 1];
                    const next = QUEUE_STATUS.frames[FRAME_STATUS.pos + 1];

                    QUEUE_STATUS.frames.splice(FRAME_STATUS.pos, 1);

                    if (next) {
                        next.pos = FRAME_STATUS.pos;
                    }

                    if (QUEUE_STATUS.frame_now === FRAME_STATUS.pos) {
                        if (next) {
                            next.checkBtn.click();
                        } else if (prev) {
                            prev.checkBtn.click();
                        } else {
                            QUEUE_STATUS.frame_now = 0;
                        }
                    }
                }
            }
        }
    );

    FRAME_DOMS.frameLayerList = createElement("ol", {});

    appendChild(QUEUE_DOMS.queueFrameList, [
        appendChild(FRAME_DOMS.frameContent, [
            appendChild(FRAME_DOMS.frameHeader, [
                FRAME_DOMS.frameChecker,
                appendChild(FRAME_DOMS.frameHeaderContent, [
                    appendChild(FRAME_DOMS.frameHeaderFrontContent, [
                        FRAME_DOMS.frameShowHide,
                        appendChild(FRAME_DOMS.frameNameSpan, [FRAME_DOMS.frameNameNode]),
                        FRAME_DOMS.frameCopyBtn,
                        FRAME_DOMS.frameNewLayerBtn,
                        FRAME_DOMS.frameRename,
                        FRAME_DOMS.frameMove_up,
                        FRAME_DOMS.frameMove_down,
                        FRAME_DOMS.frameRemove,
                    ])
                ]),
                appendChild(FRAME_DOMS.frameOperateContent, [FRAME_DOMS.framePicker])
            ]),
            FRAME_DOMS.frameLayerList
        ])
    ]);

    FRAME_DOMS.frameShowHide.click();

    FRAME_STATUS.checkBtn = FRAME_DOMS.frameChecker;

    //数据导入
    if (frameData) {
        appendChild(FRAME_DOMS.frameContent, [FRAME_DOMS.frameLayerList]);
        for (const layerData of frameData.layers) {
            createLayer(QUEUE, FRAME, layerData);
        }
    }




    /* if (STATUS.now.queue_now === QUEUE_STATUS.pos &&
        STATUS.now.frame_now === FRAME_STATUS.pos
    ) {
        FRAME_DOMS.frameChecker.click();
    
    } */
    if (QUEUE_STATUS.frames.length === 1) {
        FRAME_DOMS.frameChecker.click();
    }
}

function createLayer(QUEUE, FRAME, layerData) {
    const { QUEUE_STATUS } = QUEUE;
    const { FRAME_STATUS, FRAME_DOMS } = FRAME;
    const LAYER_DOMS = {};
    const LAYER_STATUS = (layerData) ? layerData : {
        id: `l${FRAME_STATUS.count}-${+new Date()}-${(Math.random() * 1000000).toFixed(0)}`,
        show: true,
        items: [],
        pos: +FRAME_STATUS.layers.length,
        name: `图层 ${FRAME_STATUS.count++}`
    };
    if (!layerData) FRAME_STATUS.layers.push(LAYER_STATUS);
    if (!LAYER_STATUS.id) LAYER_STATUS.id = `l${FRAME_STATUS.count++}-${+new Date()}-${(Math.random() * 1000000).toFixed(0)}`;

    LAYER_DOMS.layer = createElement("li", { "id": `layer_${LAYER_STATUS.pos}` });
    LAYER_DOMS.layerContainer = createElement("label", { "for": LAYER_STATUS.id });
    LAYER_DOMS.layerContent = createElement("div", {});
    LAYER_DOMS.layerNameNode = createTextNode(LAYER_STATUS.name);
    LAYER_DOMS.layerHide = createElement("input",
        { "type": "checkbox" },
        {
            "change": function () {
                LAYER_STATUS.show = this.checked;
            }
        }
    );

    LAYER_DOMS.layerChecker = createElement("input",
        { "class": "list_btn layer_checker", "id": LAYER_STATUS.id, "type": "radio", "name": "layer_now", "value": LAYER_STATUS.pos },
        {
            "change": function () {
                if (this.checked) {
                    QUEUE_STATUS.frame_now = FRAME_STATUS.pos;
                    FRAME_STATUS.layer_now = LAYER_STATUS.pos;
                    STATUS.now.frame_now = FRAME_STATUS.pos;
                    STATUS.now.layer_now = LAYER_STATUS.pos;
                    FRAME_DOMS.frameChecker.checked = true;
                }
            }
        }
    );

    LAYER_DOMS.layerRename = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🖊", "title": "重命名", },
        {
            "click": function () {
                const name = prompt("输入名称", LAYER_STATUS.name);
                if (name.length <= 8) {
                    LAYER_DOMS.layerNameNode.textContent = name;
                    LAYER_STATUS.name = name;
                } else {
                    alert("图层名称不能超过8个字符");
                }
            }
        }
    );

    LAYER_DOMS.layerMove_up = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🔼", "title": "上移", },
        {
            "click": function () {
                const posi = +LAYER_STATUS.pos;
                const prev_pos = LAYER_STATUS.pos - 1;
                const prev = FRAME_STATUS.layers[prev_pos];

                if (prev) {
                    const prevLi = FRAME_DOMS.frameLayerList.children[prev_pos];

                    FRAME_DOMS.frameLayerList.insertBefore(LAYER_DOMS.layer, prevLi);

                    if (FRAME_STATUS.layer_now === posi) {
                        FRAME_STATUS.layer_now = +prev_pos;
                        STATUS.now.layer_now = +prev_pos;
                    }

                    FRAME_STATUS.layers[prev_pos] = LAYER_STATUS;
                    FRAME_STATUS.layers[posi] = prev;
                    prev.pos = +posi;
                    LAYER_STATUS.pos = +prev_pos;
                }
            }
        }
    );

    LAYER_DOMS.layerMove_down = createElement("input",
        { "class": "list_btn", "type": "button", "value": "🔽", "title": "下移" },
        {
            "click": function () {
                const posi = +LAYER_STATUS.pos;
                const next_pos = LAYER_STATUS.pos + 1
                const next = FRAME_STATUS.layers[next_pos];
                if (next) {
                    const nextLi = FRAME_DOMS.frameLayerList.children[LAYER_STATUS.pos];

                    FRAME_DOMS.frameLayerList.insertBefore(nextLi, LAYER_DOMS.layer);

                    if (FRAME_STATUS.layer_now === posi) {
                        FRAME_STATUS.layer_now = +next_pos;
                        STATUS.now.layer_now = +next_pos;
                    }

                    FRAME_STATUS.layers[next_pos] = LAYER_STATUS;
                    FRAME_STATUS.layers[posi] = next;
                    next.pos = +posi;
                    LAYER_STATUS.pos = +next_pos;
                }
            }
        }
    );

    LAYER_DOMS.layerRemove = createElement("input",
        { "class": "list_btn", "type": "button", "value": "❌", "title": "删除", },
        {
            "click": function () {
                const check = confirm("是否确认删除图层，删除后无法恢复，请谨慎操作。");
                if (check) {
                    const prev = FRAME_STATUS.layers[LAYER_STATUS.pos - 1];
                    const next = FRAME_STATUS.layers[LAYER_STATUS.pos + 1];
                    FRAME_STATUS.layers.splice(LAYER_STATUS.pos, 1);
                    FRAME_DOMS.frameLayerList.removeChild(LAYER_DOMS.layer);
                    if (next) {
                        next.pos = LAYER_STATUS.pos;
                    }
                    if (FRAME_STATUS.layer_now === LAYER_STATUS.pos) {
                        if (next) {
                            next.checkBtn.click();
                        } else if (prev) {
                            prev.checkBtn.click();
                        } else {
                            FRAME_STATUS.layer_now = 0;
                        }
                    }
                }
            }
        }
    );

    LAYER_DOMS.layerCopyBtn = createElement("input",
        { "class": "list_btn", "type": "button", "value": "⛏", "title": "复制图层" },
        {
            "click": function () {
                FRAME_STATUS.count++;
                const copy = JSON.parse(JSON.stringify(LAYER_STATUS));
                const c = FRAME_STATUS.count;
                copy.pos = +FRAME_STATUS.layers.length;
                copy.id = `l${c}-${+new Date()}`;
                copy.name = `图层 ${c}`
                FRAME_STATUS.layers.push(copy);
                createLayer(QUEUE, FRAME, copy);
            }
        }
    );

    LAYER_STATUS.checkBtn = LAYER_DOMS.layerChecker;

    appendChild(FRAME_DOMS.frameLayerList, [
        appendChild(LAYER_DOMS.layer, [
            appendChild(LAYER_DOMS.layerContainer, [
                LAYER_DOMS.layerChecker,
                appendChild(LAYER_DOMS.layerContent, [
                    LAYER_DOMS.layerHide,
                    LAYER_DOMS.layerNameNode,
                    LAYER_DOMS.layerCopyBtn,
                    LAYER_DOMS.layerRename,
                    LAYER_DOMS.layerMove_up,
                    LAYER_DOMS.layerMove_down,
                    LAYER_DOMS.layerRemove
                ])
            ])
        ])
    ]);

    LAYER_DOMS.layerHide.click();

    if (FRAME_STATUS.layers.length === 1) {
        LAYER_DOMS.layerChecker.click();
    }
}

function buildSprite() {
    const cacheData = {
        width: 1,
        height: 1,
        queue_list: [],
    }

    if (!QUEUE_LIST.length) return;

    if (!QUEUE_LIST[0].frames.length) return;


    for (const queue of QUEUE_LIST) {
        let queueBulid = [];
        for (const frame of queue.frames) {
            const cacheCanvas = new OffscreenCanvas(512, 512);
            const cacheCtx = cacheCanvas.getContext("2d");
            renderLayer(cacheCtx, frame);
            queueBulid.push(cacheCanvas);
        }
        if (cacheData.width < queueBulid.length) {
            cacheData.width = queueBulid.length;
        }
        cacheData.queue_list.push(queueBulid);
    }
    if (cacheData.height < cacheData.queue_list.length) {
        cacheData.height = cacheData.queue_list.length
    }
    const dialog_box = createElement("div", { "class": "dialog_box", });
    const dialog_header = createElement("div", { "class": "dialog_header" });
    const dialog_footer = createElement("div", { "class": "dialog_footer" });
    const dialog_title = createTextNode(STATUS.title ? STATUS.title : "未命名");
    const dialog_body = createElement("div", { "class": "dialog_body" });
    const mask = createElement("div", { "class": "mask" });
    const buildCanvas = createElement("canvas", {
        "width": 128 * cacheData.width,
        "height": 128 * cacheData.height,
        "class": "build_canvas",

    });

    const close_dialog = createElement("input",
        { "class": "btn", "type": "button", "value": "❌", },
        {
            "click": function () {
                removeChild(document.body, [mask, dialog_box]);
            }
        }
    );

    const save_sprite_image = createElement(
        "input",
        { "class": "font_btn", "type": "button", "value": "保存精灵图", },
        {
            "click": function () {
                const URL = buildCanvas.toDataURL()
                saveImage(buildCanvas.toDataURL(), STATUS.title ? STATUS.title : "未命名", "png");
            }
        }
    );


    const buildCtx = buildCanvas.getContext("2d");
    for (let i = 0; i < cacheData.height; i++) {
        const y = i * 128;
        for (let j = 0; j < cacheData.width; j++) {
            const x = j * 128;
            buildCtx.drawImage(cacheData.queue_list[i][j], x, y, 128, 128);
        }
    }

    appendChild(document.body, [mask,
        appendChild(dialog_box, [
            appendChild(dialog_header, [dialog_title, close_dialog]),
            appendChild(dialog_body, [buildCanvas]),
            appendChild(dialog_footer, [save_sprite_image])
        ])
    ]);
}