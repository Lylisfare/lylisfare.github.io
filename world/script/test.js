//test();
function test() {
    if (!gameover) {
        rollBtn.click();
        setTimeout(test, 20);
    }
}