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
                        100,
                        4);
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
        window.addEventListener("resize", (event) => {
            handleResize();
        });
        handleResize();

        Mouse.handle(gameCanvas);

        ctx.font
        loadGame();

        let loadingPanel = document.getElementById("loading-panel");
        let startPanel = document.getElementById("start-panel");
        let startButton = document.getElementById("start-button");
        let gameInfo = document.getElementById("game-info");

        loadingPanel.style.display = "none";
        startPanel.style.display = "block";

        if (SaveState.getHighScore() != null) {
            ScoreUtilities.displayHighScore();
        }

        startButton.onclick = (event) => {
            startPanel.style.display = "none";
            gameInfo.style.display = "block";
            gameCanvas.style.display = "block";
            SoundManager.mobileInit();
            SoundManager.background.play();
            looper.start();
        }
    }

    window.addEventListener("load", (event) => GameManager.init(() => init()));

    function blur(): void {
        SoundManager.blur();
    }
    function focus(): void {
        SoundManager.focus();
    }

    window.addEventListener("blur", (event) => blur());
    window.addEventListener("focus", (event) => focus());
    window.addEventListener("visibilitychange", (event) => {
        if (document.hidden) {
            blur();
        } else {
            focus();
        }
    });

    const M_KEY = 77;
    window.addEventListener("keydown", (event) => {
        if (event.keyCode == M_KEY) {
            SoundManager.toggleMute();
        }
    });
}
