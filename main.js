var idArray1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var idArray2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var idArray3 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var TileInformation = (function () {
    function TileInformation(id) {
        this.id = id;
    }
    TileInformation.loadFromIdArray = function (idArray) {
        var tileArray = [];
        for (var row = 0; row < idArray.length; row++) {
            tileArray.push([]);
            for (var col = 0; col < idArray[row].length; col++) {
                tileArray[tileArray.length - 1].push(new TileInformation(idArray[row][col]));
            }
        }
        return tileArray;
    };
    TileInformation.prototype.getFillStyle = function () {
        return TileInformation.tileFillStyleMap[this.id];
    };
    TileInformation.prototype.isBlocked = function () {
        return TileInformation.tileBlockedMap[this.id];
    };
    TileInformation.tileFillStyleMap = {
        0: "white",
        1: "black"
    };
    TileInformation.tileBlockedMap = {
        0: false,
        1: true
    };
    return TileInformation;
}());
var Chunk = (function () {
    function Chunk(tileArray) {
        this.tileArray = tileArray;
    }
    Chunk.prototype.update = function (dt) {
    };
    Chunk.prototype.render = function (ctx, leftBound, rightBound, offset) {
        for (var row = 0; row < this.tileArray.length; row++) {
            for (var col = leftBound; col < rightBound; col++) {
                var tileInfo = this.tileArray[row][col];
                ctx.fillStyle = tileInfo.getFillStyle();
                ctx.fillRect(col * ChunkManager.TILE_SIZE + offset, row * ChunkManager.TILE_SIZE, ChunkManager.TILE_SIZE, ChunkManager.TILE_SIZE);
            }
        }
    };
    return Chunk;
}());
var ChunkManager;
(function (ChunkManager) {
    ChunkManager.CHUNK_WIDTH = 20;
    ChunkManager.CHUNK_HEIGHT = 8;
    ChunkManager.TILE_SIZE = 32;
    function init() {
        ChunkManager.chunkLoaders = [];
        ChunkManager.chunkLoaders.push(function () { return new Chunk(TileInformation.loadFromIdArray(idArray1)); });
        ChunkManager.chunkLoaders.push(function () { return new Chunk(TileInformation.loadFromIdArray(idArray2)); });
        ChunkManager.chunkLoaders.push(function () { return new Chunk(TileInformation.loadFromIdArray(idArray3)); });
    }
    ChunkManager.init = init;
    function generateRandomChunk() {
        return MathUtilities.randSelection(ChunkManager.chunkLoaders)();
    }
    ChunkManager.generateRandomChunk = generateRandomChunk;
})(ChunkManager || (ChunkManager = {}));
var CollisionDirection;
(function (CollisionDirection) {
    CollisionDirection[CollisionDirection["X"] = 0] = "X";
    CollisionDirection[CollisionDirection["Y"] = 1] = "Y";
})(CollisionDirection || (CollisionDirection = {}));
var Game = (function () {
    function Game(tileSpeed, gravity) {
        this.tileSpeed = tileSpeed;
        this.gravity = gravity;
        this.offset = 0;
        this.offsetTile = 0;
        this.currentChunk = ChunkManager.generateRandomChunk();
        this.nextChunk = ChunkManager.generateRandomChunk();
    }
    Game.prototype.update = function (dt) {
        this.offset += this.tileSpeed * ChunkManager.TILE_SIZE * dt;
        if (this.offset >= ChunkManager.TILE_SIZE) {
            this.offset -= ChunkManager.TILE_SIZE;
            this.offsetTile += 1;
        }
        if (this.offsetTile >= ChunkManager.CHUNK_WIDTH) {
            this.offsetTile = 0;
            this.currentChunk = this.nextChunk;
            this.nextChunk = ChunkManager.generateRandomChunk();
        }
        this.player.update(dt);
    };
    Game.prototype.render = function (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.currentChunk.render(ctx, this.offsetTile, ChunkManager.CHUNK_WIDTH, -this.offsetTile * ChunkManager.TILE_SIZE
            - this.offset);
        this.nextChunk.render(ctx, 0, this.offsetTile + 1, ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE
            - this.offsetTile * ChunkManager.TILE_SIZE
            - this.offset);
        // TODO remove world bound indicator
        ctx.fillStyle = "rgba(255, 0, 0, 0.9)";
        ctx.fillRect(ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE, 0, 10000, 10000);
        this.player.render(ctx);
    };
    Game.prototype.tileInformationFromCoordinate = function (x, y) {
        var row = Math.floor(y / ChunkManager.TILE_SIZE);
        var col = Math.floor(x / ChunkManager.TILE_SIZE);
        if (row >= ChunkManager.CHUNK_HEIGHT || row < 0 ||
            col >= ChunkManager.CHUNK_WIDTH || col < 0) {
            return null;
        }
        else {
            col += this.offsetTile;
            if (col >= ChunkManager.CHUNK_WIDTH) {
                return this.nextChunk
                    .tileArray[row][col - ChunkManager.CHUNK_WIDTH];
            }
            else {
                return this.currentChunk.tileArray[row][col];
            }
        }
    };
    return Game;
}());
var Mouse;
(function (Mouse) {
    var mouseDown;
    function init(initialPos) {
        if (initialPos === void 0) { initialPos = new Vector(window.innerWidth / 2, window.innerHeight / 2); }
        Mouse.pos = initialPos;
        mouseDown = false;
    }
    Mouse.init = init;
    function isMouseDown() {
        return mouseDown;
    }
    Mouse.isMouseDown = isMouseDown;
    window.onmousemove = function (event) {
        Mouse.pos.x = event.pageX;
        Mouse.pos.y = event.pageY;
    };
    window.onmousedown = function (event) {
        mouseDown = true;
    };
    window.onmouseup = function (event) {
        mouseDown = false;
    };
})(Mouse || (Mouse = {}));
var Keyboard;
(function (Keyboard) {
    var keysDown;
    function init() {
        keysDown = {};
    }
    Keyboard.init = init;
    function isKeyDown(keyCode) {
        // Cannot just return Keyboard.keys[keyCode] because it may be null
        return keysDown[keyCode] == true;
    }
    Keyboard.isKeyDown = isKeyDown;
    window.onkeydown = function (event) {
        keysDown[event.keyCode] = true;
    };
    window.onkeyup = function (event) {
        keysDown[event.keyCode] = false;
    };
})(Keyboard || (Keyboard = {}));
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
function init() {
    Mouse.init();
    Keyboard.init();
    ChunkManager.init();
    var gameCanvas = document.getElementById("game");
    var ctx = gameCanvas.getContext("2d");
    window.onresize = function (event) {
        CanvasUtilities.fitCanvasToWindow(gameCanvas);
    };
    CanvasUtilities.fitCanvasToWindow(gameCanvas);
    ctx.font = "24px Arial";
    ctx.fillText("Click to Start", 100, 100);
    var player;
    var game;
    var looper;
    game = new Game(10, 100 * ChunkManager.TILE_SIZE);
    player = new Player(game, new BoundingBox(3 * ChunkManager.TILE_SIZE, 0, ChunkManager.TILE_SIZE, ChunkManager.TILE_SIZE), new Vector(0, 0), 30 * ChunkManager.TILE_SIZE, 2);
    game.player = player;
    looper = new Looper(1 / 60, game, game, ctx);
    gameCanvas.onclick = function (event) {
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
var Player = (function () {
    function Player(game, bb, velocity, jumpPower, maxJumps) {
        this.game = game;
        this.bb = bb;
        this.velocity = velocity;
        this.jumpPower = jumpPower;
        this.maxJumps = maxJumps;
        this.canJumpAgain = true;
        this.jumpsLeft = maxJumps;
    }
    Player.prototype.update = function (dt) {
        this.velocity.y += this.game.gravity * dt;
        this.bb.y += this.velocity.y * dt;
        this.grounded = false;
        if (this.collidesWithMap(CollisionDirection.Y)) {
            if (this.velocity.y < 0) {
                this.bb.y =
                    Math.ceil(this.bb.y / ChunkManager.TILE_SIZE)
                        * ChunkManager.TILE_SIZE;
            }
            else if (this.velocity.y > 0) {
                this.bb.y =
                    Math.floor(this.bb.bottom() / ChunkManager.TILE_SIZE)
                        * ChunkManager.TILE_SIZE - this.bb.height;
                this.grounded = true;
                this.jumpsLeft = this.maxJumps;
            }
            this.velocity.y = 0;
        }
        this.handleInput();
    };
    Player.prototype.render = function (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.bb.x, this.bb.y, this.bb.width, this.bb.height);
    };
    Player.prototype.collidesWithMap = function (d) {
        var tileInfo;
        var modifier;
        for (var i = 0; i < 3; i++) {
            modifier = Player.collisionModifiers[i];
            if (d == CollisionDirection.X) {
                tileInfo = this.game.tileInformationFromCoordinate(this.bb.x, this.bb.y + this.bb.height * modifier);
            }
            else if (d == CollisionDirection.Y) {
                if (this.velocity.y < 0) {
                    tileInfo = this.game.tileInformationFromCoordinate(this.bb.x + this.bb.width * modifier, this.bb.y);
                }
                else if (this.velocity.y > 0) {
                    tileInfo = this.game.tileInformationFromCoordinate(this.bb.x + this.bb.width * modifier, this.bb.bottom());
                }
            }
            if (tileInfo != null && tileInfo.isBlocked()) {
                return true;
            }
        }
        return false;
    };
    Player.prototype.handleInput = function () {
        var jumpPressed = Keyboard.isKeyDown(32) || Mouse.isMouseDown();
        if (!jumpPressed) {
            this.canJumpAgain = true;
        }
        if (this.canJump() && jumpPressed) {
            this.jump();
            this.canJumpAgain = false;
        }
    };
    Player.prototype.canJump = function () {
        return this.grounded || (this.jumpsLeft > 0 && this.canJumpAgain);
    };
    Player.prototype.jump = function () {
        this.velocity.y = -this.jumpPower;
        this.jumpsLeft -= 1;
    };
    Player.collisionModifiers = [0.01, 0.5, 0.99];
    return Player;
}());
var CanvasUtilities;
(function (CanvasUtilities) {
    function fitCanvasToWindow(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    CanvasUtilities.fitCanvasToWindow = fitCanvasToWindow;
})(CanvasUtilities || (CanvasUtilities = {}));
var MathUtilities;
(function (MathUtilities) {
    // Returns a random integer in the range [min, max).
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    MathUtilities.randInt = randInt;
    function randSelection(array) {
        return array[randInt(0, array.length)];
    }
    MathUtilities.randSelection = randSelection;
})(MathUtilities || (MathUtilities = {}));
