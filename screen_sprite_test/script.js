const MAIN = document.getElementById("main");
const ATTR = document.getElementById("attr");
const CIW = document.getElementById("ctrl_input_w");
const CIH = document.getElementById("ctrl_input_h");

const ACCURACY = { width: 16, height: 16 };

window.addEventListener("load", function () {

    updateMain(this.innerWidth, this.innerHeight);

});

window.addEventListener("resize", function () {

    updateMain(this.innerWidth, this.innerHeight);

});

CIW.addEventListener("change", function () {
    const value = +this.value;

    if (!isNaN(value) && value !== 0) {
        ACCURACY.width = value;
        updateMain(window.innerWidth, window.innerHeight);
    }
});

CIH.addEventListener("change", function () {
    const value = +this.value;

    if (!isNaN(value) && value !== 0) {
        ACCURACY.height = value;
        updateMain(window.innerWidth, window.innerHeight);
    }
});

function updateMain(width, height) {
    const iw = width;
    const ih = height;

    const mx = iw % ACCURACY.width;
    const my = ih % ACCURACY.height;

    const mw = iw - mx;
    const mh = ih - my;
    const cx = mw / ACCURACY.width;
    const cy = mh / ACCURACY.height;
    const sx = cx * ACCURACY.width;
    const sy = cy * ACCURACY.height;


    const hx = mx / 2;
    const hy = my / 2;

    ATTR.innerHTML = `
        图块尺寸：${ACCURACY.width}px * ${ACCURACY.height}px; <br/>
        水平图块：${cx}; <br/>
        垂直图块：${cy}; <br/>
        总数量：${(cx * cy).toLocaleString()}; <br/>
    `
    MAIN.style = `margin:${hy}px ${hx}px ${hy}px ${hx}px; width:${sx}px; height:${sy}px;`;
}