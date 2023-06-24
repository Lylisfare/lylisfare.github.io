//标题
const CHANGE_TITLE = document.getElementById("change-title");
const TITLE_CONTENT = document.getElementById("title-content");

//主画布
const CANVAS = document.getElementById("canvas");
const CTX = CANVAS.getContext("2d");

//调色盘
const PALETTE = document.getElementById("palette");

//图层
const LAYER_LIST = document.getElementById("layer_list");
const NEW_LAYER = document.getElementById("new_layer");

//序列
const NEW_QUEUE = document.getElementById("new_queue");
const QUEUE_LIST_CONTAINER = document.getElementById("queue_list_container");
const QUEUE_LIST_CONTENT = createElement("div", { "class": "list" });
const QUEUE_LIST_PICKER = document.getElementById("queue_list_picker");

//帧
const NEW_FRAME = document.getElementById("new_frame");
const PLAY_QUEUE = document.getElementById("play_queue");
const FRAME_LIST_CONTAINER = document.getElementById("frame_list_container");
const FRAME_LIST_CONTENT = createElement("div", { "class": "list" });
const FRAME_LIST_PICKER = document.getElementById("frame_list_picker");

//颜色
const COLOR = document.getElementById("color");

//工具
const PEN = document.getElementById("pen");
const ERASER = document.getElementById("eraser");
const UNDO = document.getElementById("undo");
const REDO = document.getElementById("redo");
const FLIP = document.getElementById("flip_canvas");
const KEEP = document.getElementById("keep_draw");
const IMPORT = document.getElementById("import");
const EXPORT = document.getElementById("export");
const BUILD = document.getElementById("buildSprite");
const LIGHT = document.getElementById("light_mode");
const FLIP_HORZON = document.getElementById("flip_horzon");
const FLIP_VERTICAL = document.getElementById("flip_vertical");
const FLIP_CENTER = document.getElementById("flip_center");

                    

