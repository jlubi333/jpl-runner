/// <reference path="jquery.d.ts" />

////////////////////////////////////////////////////////////////////////////////
// Variables                                                                  //
////////////////////////////////////////////////////////////////////////////////

/*
 * Constants
 */
const FIXED_TIMESTEP = 1 / 60;
const FIXED_TIMESTEP_MS = 1000 * FIXED_TIMESTEP;

/*
 * Mouse variables
 */
let mouseX: number;
let mouseY: number;

/*
 * Canvas variables
 */
let gameCanvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

/*
 * Loop variables
 */
let frameId: number;
let previousTimestamp: number;
let unsimulatedTime: number = 0;

////////////////////////////////////////////////////////////////////////////////
// Utilities                                                                  //
////////////////////////////////////////////////////////////////////////////////

function fitCanvasToWindow(canvas: HTMLCanvasElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let currentChunk = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

////////////////////////////////////////////////////////////////////////////////
// Loop                                                                       //
////////////////////////////////////////////////////////////////////////////////


let offset = 0;
let offsetTile = 0;
const tileSize = 100;

function update(dt: number): void {
    offset += 5 * tileSize * dt;
    if (offset >= tileSize) {
        offset -= tileSize;
        offsetTile += 1;
    }
}

function render(): void {
    const ro = Math.round(offset);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 10; col++) {
            let nc = col + offsetTile;
            if (currentChunk[row][nc % 20]) {
                ctx.fillRect(col * tileSize - ro, row * tileSize, tileSize, tileSize);
            }
        }
        if (currentChunk[row][(10+offsetTile)%20]) {
            ctx.fillRect(10 * tileSize - ro, row * tileSize, ro, tileSize);
        }
    }
    ctx.fillRect(tileSize, 4*tileSize, tileSize, tileSize);
}

function mainLoop(timestamp: number): void {
    const deltaTimestamp = timestamp - previousTimestamp;
    unsimulatedTime += deltaTimestamp;
    previousTimestamp = timestamp;

    let updateCount = 0;
    while (unsimulatedTime >= FIXED_TIMESTEP_MS) {
        update(FIXED_TIMESTEP);
        unsimulatedTime -= FIXED_TIMESTEP_MS;
        updateCount += 1;
        if (updateCount >= 10) {
            unsimulatedTime = 0;
            break;
        }
    }

    if (updateCount > 0) {
        render();
    }

    window.requestAnimationFrame(mainLoop);
}

////////////////////////////////////////////////////////////////////////////////
// Main                                                                       //
////////////////////////////////////////////////////////////////////////////////

function init(): void {
    // Variables
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    gameCanvas = <HTMLCanvasElement> document.getElementById("game");
    ctx = gameCanvas.getContext("2d");

    // Handlers
    window.onmousemove = (event) => {
        mouseX = event.pageX;
        mouseY = event.pageY;
    };
    window.onresize = (event) => {
        fitCanvasToWindow(gameCanvas);
    };
    fitCanvasToWindow(gameCanvas);

    ctx.font = "24px Arial";
    ctx.fillText("Click to Start", 100, 100);
    window.onclick = () => {
        // Loop
        frameId = window.requestAnimationFrame((timestamp) => {
            previousTimestamp = timestamp;
            frameId = window.requestAnimationFrame(mainLoop);
        });
    }
}

window.onload = (event) => init();
