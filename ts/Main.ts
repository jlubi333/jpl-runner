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

    let player: Player;
    let game: Game;
    let looper: Looper;

    game = new Game(10,
                    100 * ChunkManager.TILE_SIZE);
    player = new Player(game,
                        new BoundingBox(3 * ChunkManager.TILE_SIZE,
                                        0,
                                        ChunkManager.TILE_SIZE,
                                        ChunkManager.TILE_SIZE),
                        new Vector(0, 0),
                        30 * ChunkManager.TILE_SIZE,
                        2);
    game.player = player;
    looper = new Looper(1/60, game, game, ctx);

    gameCanvas.onclick = (event) => {
        looper.start();
    };
}

window.onload = (event) => init();
