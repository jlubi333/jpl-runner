namespace Main {
    let gameCanvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let looper: Looper;
    let player: Player;
    let game: Game;

    export function restart() {
        looper.stop();
        loadGame();
        looper.start();
    }

    export function loadGame() {
        game = new Game(10,
                        100 * ChunkManager.tileSize);
        player = new Player(game,
                            new BoundingBox(3 * ChunkManager.tileSize,
                                            0,
                                            ChunkManager.tileSize,
                                            ChunkManager.tileSize),
                            new Vector(0, 0),
                            30 * ChunkManager.tileSize,
                            2);
        game.player = player;
        looper = new Looper(1/60, game, game, ctx);
    }

    export function init(): void {
        Mouse.init();
        Keyboard.init();
        ChunkManager.init();

        gameCanvas = <HTMLCanvasElement> document.getElementById("game");
        ctx = gameCanvas.getContext("2d");

        let handleResize = () => {
            CanvasUtilities.fitCanvasToWindow(gameCanvas);
            ChunkManager.tileSize = window.innerHeight / ChunkManager.CHUNK_HEIGHT;
        }
        window.onresize = (event) => {
            handleResize();
        };
        handleResize();

        ctx.font
        loadGame();

        let startButton = <HTMLElement> document.getElementById("start-button");
        startButton.onclick = (event) => {
            startButton.style.display = "none";
            gameCanvas.style.display = "block";
            looper.start();
        }
    }

    window.onload = (event) => init();
}
