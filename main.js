/// <reference path="jquery.d.ts" />
////////////////////////////////////////////////////////////////////////////////
// Variables                                                                  //
////////////////////////////////////////////////////////////////////////////////
/*
 * Constants
 */
var FIXED_TIMESTEP = 1 / 60;
var FIXED_TIMESTEP_MS = 1000 * FIXED_TIMESTEP;
/*
 * Mouse variables
 */
var mouseX;
var mouseY;
/*
 * Canvas variables
 */
var gameCanvas;
var ctx;
/*
 * Loop variables
 */
var frameId;
var previousTimestamp;
var unsimulatedTime = 0;
////////////////////////////////////////////////////////////////////////////////
// Utilities                                                                  //
////////////////////////////////////////////////////////////////////////////////
function fitCanvasToWindow(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
var currentChunk = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
////////////////////////////////////////////////////////////////////////////////
// Loop                                                                       //
////////////////////////////////////////////////////////////////////////////////
var offset = 0;
var offsetTile = 0;
var tileSize = 100;
function update(dt) {
    offset += 5 * tileSize * dt;
    if (offset >= tileSize) {
        offset -= tileSize;
        offsetTile += 1;
    }
}
function render() {
    var ro = Math.round(offset);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 10; col++) {
            var nc = col + offsetTile;
            if (currentChunk[row][nc % 20]) {
                ctx.fillRect(col * tileSize - ro, row * tileSize, tileSize, tileSize);
            }
        }
        if (currentChunk[row][(10 + offsetTile) % 20]) {
            ctx.fillRect(10 * tileSize - ro, row * tileSize, ro, tileSize);
        }
    }
    ctx.fillRect(tileSize, 4 * tileSize, tileSize, tileSize);
}
function mainLoop(timestamp) {
    var deltaTimestamp = timestamp - previousTimestamp;
    unsimulatedTime += deltaTimestamp;
    previousTimestamp = timestamp;
    var updateCount = 0;
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
function init() {
    // Variables
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    gameCanvas = document.getElementById("game");
    ctx = gameCanvas.getContext("2d");
    // Handlers
    window.onmousemove = function (event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    };
    window.onresize = function (event) {
        fitCanvasToWindow(gameCanvas);
    };
    fitCanvasToWindow(gameCanvas);
    ctx.font = "24px Arial";
    ctx.fillText("Click to Start", 100, 100);
    window.onclick = function () {
        // Loop
        frameId = window.requestAnimationFrame(function (timestamp) {
            previousTimestamp = timestamp;
            frameId = window.requestAnimationFrame(mainLoop);
        });
    };
}
window.onload = function (event) { return init(); };
