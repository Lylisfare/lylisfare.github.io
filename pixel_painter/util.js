function exportData(jsonData = "", fileType = "json") {
    let mapName = prompt("输入文件名称");
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
    input.addEventListener("change", function (e) {
        let file = this.files[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.addEventListener("load", function () {
                callback(this.result);
            });
        }
    });

    input.click();
}