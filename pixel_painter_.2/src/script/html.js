HTMLElement.prototype.addEvent = function (type, listener, options_useCapture) {

    if (type === "click" || type === "dblclick") {
        let flag = 0;

        function fnCallback(event) {
            if (!flag) {
                flag = 1;
                listener.call(this, event);
                setTimeout(() => { flag = 0; }, 0);
            }
        }

        this.addEventListener(type, fnCallback, options_useCapture);
    } else {
        this.addEventListener(type, listener, options_useCapture);
    }
}

