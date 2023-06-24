function exportData(jsonData = "", fileType = "json", title) {
    let mapName = (title) ? title : prompt("输入文件名称");
    if (!mapName) return;

    /**
     * 以json形式输出
     */

    let afn = document.createElement("a");
    let blob = new Blob([jsonData]);
    afn.download = `${mapName}.${fileType}`;
    afn.href = URL.createObjectURL(blob);
    afn.click();
    URL.revokeObjectURL(blob);
    afn = null;
    blob = null;
}

function importData(callback = console.log) {
    /**
     * 以json形式读取
     */

    let input = document.createElement("input");
    input.type = "file";
    input.addEvent("change", function (e) {
        let file = this.files[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.addEvent("load", function () {
                callback(this.result);
            });
        }
    });

    input.click();
}

function createElement(tagname = "div", attrs = {}, eventListener = {}) {
    const el = document.createElement(tagname);
    const keys = Object.keys(attrs);
    if (keys.length > 0) {
        try {

            for (const key of keys) {
                el.setAttribute(key, attrs[key]);
            }

        } catch (e) {
            console.log(e);
            debugger
        }
    }
    const eKeys = Object.keys(eventListener);
    
    if (eKeys.length > 0) {
        for (const eKey of eKeys) {
            const eventCallback = eventListener[eKey]
            if (Array.isArray(eventCallback)) {
                for (const event of eventCallback) {
                    el.addEvent(eKey, event);
                }
            } else {
                el.addEvent(eKey, eventCallback);
            }
        }
    }

    return el;
}

function createTextNode(...text) {
    const textNode = document.createTextNode("");
    for (let t of text) {
        textNode.textContent += t;
    }
    return textNode;
}

function appendChild(el, clds = []) {
    for (const cld of clds) {
        el.appendChild(cld);
    }

    return el;
}

function clearChilds(el) {
    el.innerHTML = "";
}

function removeChild(el, clds = []) {
    for (const cld of clds) {
        el.removeChild(cld);
    }

    return el;
}

class TimeSteper {
    constructor(timeStep) {
        this.timeStep = timeStep;
        this.last = new Date();
    }
    reset() {
        this.last = new Date();
    }
    step() {
        let now = new Date();
        let elapsed = now - this.last;
        if (elapsed > this.timeStep) {
            this.last = now;
            return true;
        } else {
            return false;
        }
    }
}

function saveImage(dataURL, name, type = "png") {
    let byte = atob(dataURL.split(",")[1]);
    let buffer = new ArrayBuffer(byte.length);
    let imageArray = new Uint8Array(buffer);
    for (let i = 0; i < byte.length; i++) {
        imageArray[i] = byte.charCodeAt(i);
    }
    let blob = new Blob([imageArray], { type: `image/${type}` });
    let afn = document.createElement("a");
    afn.download = `${name}.${type}`;
    afn.href = URL.createObjectURL(blob);
    afn.click();
    URL.revokeObjectURL(blob);
    afn = null;
    blob = null;
}