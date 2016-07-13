let mouseX: number;
let mouseY: number;

function init(): void {
    /*
     * Mouse
     */
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    window.onmousemove = (event) => {
        mouseX = event.pageX;
        mouseY = event.pageY;
    };

    /*
     * Canvas
     */
    let gameCanvas = <HTMLCanvasElement> document.getElementById("game");
    window.onresize = (event) => {
        fitCanvasToWindow(gameCanvas);
    };
    fitCanvasToWindow(gameCanvas);
    let ctx = gameCanvas.getContext("2d");
    ctx.font = "24px Arial";
    ctx.fillText("Click to Start", 100, 100);

    /*
     * Game
     */
    let game = new Game(5, 32);
    let looper = new Looper(1/60, game, game, ctx);

    window.onclick = () => {
        looper.start();
    };

}

window.onload = (event) => init();
