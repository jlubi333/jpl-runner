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
var Game = (function () {
    function Game(tileSpeed, tileSize) {
        this.tileSpeed = tileSpeed;
        this.tileSize = tileSize;
        this.offset = 0;
        this.offsetTile = 0;
    }
    Game.prototype.update = function (dt) {
        this.offset += this.tileSpeed * this.tileSize * dt;
        if (this.offset >= this.tileSize) {
            this.offset -= this.tileSize;
            this.offsetTile += 1;
        }
    };
    Game.prototype.render = function (ctx) {
        var ro = Math.round(this.offset);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 10; col++) {
                var nc = col + this.offsetTile;
                if (currentChunk[row][nc % 20]) {
                    ctx.fillRect(col * this.tileSize - ro, row * this.tileSize, this.tileSize, this.tileSize);
                }
            }
            if (currentChunk[row][(10 + this.offsetTile) % 20]) {
                ctx.fillRect(10 * this.tileSize - ro, row * this.tileSize, ro, this.tileSize);
            }
        }
        ctx.fillRect(this.tileSize, 4 * this.tileSize, this.tileSize, this.tileSize);
    };
    return Game;
}());
var Looper = (function () {
    function Looper(fixedTimestep, updatable, renderable, ctx) {
        var _this = this;
        this.fixedTimestep = fixedTimestep;
        this.updatable = updatable;
        this.renderable = renderable;
        this.ctx = ctx;
        this.unsimulatedTime = 0;
        // Captures "this" correctly for requestAnimationFrame
        this.loop = function (timestamp) {
            var deltaTimestamp = timestamp - _this.previousTimestamp;
            _this.unsimulatedTime += deltaTimestamp;
            _this.previousTimestamp = timestamp;
            var updateCount = 0;
            while (_this.unsimulatedTime >= _this.fixedTimestepMs) {
                _this.updatable.update(_this.fixedTimestep);
                _this.unsimulatedTime -= _this.fixedTimestepMs;
                updateCount += 1;
                if (updateCount >= 10) {
                    _this.unsimulatedTime = 0;
                    break;
                }
            }
            if (updateCount > 0) {
                _this.renderable.render(_this.ctx);
            }
            window.requestAnimationFrame(_this.loop);
        };
        this.fixedTimestepMs = 1000 * this.fixedTimestep;
    }
    Looper.prototype.start = function () {
        var _this = this;
        this.frameId = window.requestAnimationFrame(function (timestamp) {
            _this.previousTimestamp = timestamp;
            _this.frameId = window.requestAnimationFrame(_this.loop);
        });
    };
    Looper.prototype.stop = function () {
        window.cancelAnimationFrame(this.frameId);
    };
    return Looper;
}());
var mouseX;
var mouseY;
function init() {
    /*
     * Mouse
     */
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    window.onmousemove = function (event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    };
    /*
     * Canvas
     */
    var gameCanvas = document.getElementById("game");
    window.onresize = function (event) {
        fitCanvasToWindow(gameCanvas);
    };
    fitCanvasToWindow(gameCanvas);
    var ctx = gameCanvas.getContext("2d");
    ctx.font = "24px Arial";
    ctx.fillText("Click to Start", 100, 100);
    /*
     * Game
     */
    var game = new Game(5, 32);
    var looper = new Looper(1 / 60, game, game, ctx);
    window.onclick = function () {
        looper.start();
    };
}
window.onload = function (event) { return init(); };
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vector;
}());
var BoundingBox = (function () {
    function BoundingBox(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    BoundingBox.prototype.right = function () {
        return this.x + this.width;
    };
    BoundingBox.prototype.bottom = function () {
        return this.y + this.height;
    };
    return BoundingBox;
}());
var GRAVITY = 1000;
var Player = (function () {
    function Player(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }
    Player.prototype.update = function (dt) {
    };
    Player.prototype.render = function (ctx) {
    };
    return Player;
}());
function fitCanvasToWindow(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
