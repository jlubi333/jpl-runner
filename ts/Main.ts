function init(): void {
    Mouse.init();
    Keyboard.init();
    ChunkManager.init();

    let gameCanvas = <HTMLCanvasElement> document.getElementById("game");
    let ctx = gameCanvas.getContext("2d");

    window.onresize = (event) => {
        CanvasUtilities.fitCanvasToWindow(gameCanvas);
    };
    CanvasUtilities.fitCanvasToWindow(gameCanvas);

    ctx.font = "24px Arial";
    ctx.fillText("Click to Start", 100, 100);

    let game = new Game(5);
    let looper = new Looper(1/60, game, game, ctx);

    gameCanvas.onclick = (event) => {
        looper.start();
    };
}

window.onload = (event) => init();
