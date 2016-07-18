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
                        0.5,
                        100);
        player = new Player(game,
                            new BoundingBox(3, -1, 1,1),
                            new Vector(0, 0),
                            30,
                            2);
        game.player = player;
        looper = new Looper(1/60, game, game, ctx);
    }

    export function init(): void {
        gameCanvas = <HTMLCanvasElement> document.getElementById("game");
        ctx = gameCanvas.getContext("2d");

        let handleResize = () => {
            CanvasUtilities.fitCanvasToWindow(gameCanvas);
            Scale.scale = window.innerHeight / ChunkManager.chunkHeight;
        }
        window.onresize = (event) => {
            handleResize();
        };
        handleResize();

        ctx.font
        loadGame();

        let loadingPanel = document.getElementById("loading-panel");
        let startPanel = document.getElementById("start-panel");
        let startButton = document.getElementById("start-button");

        loadingPanel.style.display = "none";
        startPanel.style.display = "block";

        if (SaveState.getHighScore() != null) {
            let highScoreOutput = document.getElementById("high-score");
            highScoreOutput.innerHTML = "High Score: " +
                                         Math.round(SaveState.getHighScore());
        }

        startButton.onclick = (event) => {
            startPanel.style.display = "none";
            gameCanvas.style.display = "block";
            looper.start();
        }
    }

    window.onload = (event) => GameManager.init(() => init());
}
