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
    TileInformation.prototype.getStrokeStyle = function () {
        return TileInformation.tileStrokeStyleMap[this.id];
    };
    TileInformation.prototype.isBlocked = function () {
        return TileInformation.tileBlockedMap[this.id];
    };
    TileInformation.tileFillStyleMap = {
        0: "#000000",
        1: "#333333"
    };
    TileInformation.tileStrokeStyleMap = {
        0: "#000000",
        1: "#222222"
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
                CanvasUtilities.fillStrokeRect(ctx, tileInfo.getFillStyle(), tileInfo.getStrokeStyle(), col * ChunkManager.tileSize + offset, row * ChunkManager.tileSize, ChunkManager.tileSize, ChunkManager.tileSize, 1);
            }
        }
    };
    return Chunk;
}());
var ChunkManager;
(function (ChunkManager) {
    var ASSET_TYPE = "chunks";
    function init(callback) {
        var chunkRequest = new XMLHttpRequest();
        chunkRequest.onload = function () {
            var response = JSON.parse(this.responseText);
            ChunkManager.chunkWidth = response["chunkWidth"];
            ChunkManager.chunkHeight = response["chunkHeight"];
            var idArrays = response["chunks"];
            ChunkManager.chunkLoaders = [];
            var _loop_1 = function(i) {
                var idArray = idArrays[i];
                if (idArray.length != ChunkManager.chunkHeight) {
                    console.error("Chunk #" + i +
                        " height does not match chunkHeight.");
                }
                if (idArray[0].length != ChunkManager.chunkWidth) {
                    console.error("Chunk #" + i +
                        " width does not match chunkWidth.");
                }
                ChunkManager.chunkLoaders.push(function () { return new Chunk(TileInformation.loadFromIdArray(idArray)); });
            };
            for (var i = 0; i < idArrays.length; i++) {
                _loop_1(i);
            }
            callback();
        };
        chunkRequest.open("GET", GameManager.getAssetFile(ASSET_TYPE), true);
        chunkRequest.send();
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
        this.score = 0;
        this.currentChunk = ChunkManager.generateRandomChunk();
        this.nextChunk = ChunkManager.generateRandomChunk();
        SoundManager.background.play();
    }
    Game.prototype.update = function (dt) {
        this.score += 100 * dt;
        this.offset += this.tileSpeed * ChunkManager.tileSize * dt;
        if (this.offset >= ChunkManager.tileSize) {
            this.offset -= ChunkManager.tileSize;
            this.offsetTile += 1;
        }
        if (this.offsetTile >= ChunkManager.chunkWidth) {
            this.offsetTile = 0;
            this.currentChunk = this.nextChunk;
            this.nextChunk = ChunkManager.generateRandomChunk();
        }
        this.player.update(dt);
    };
    Game.prototype.render = function (ctx) {
        CanvasUtilities.clear(ctx);
        this.currentChunk.render(ctx, this.offsetTile, ChunkManager.chunkWidth, -this.offsetTile * ChunkManager.tileSize
            - this.offset);
        this.nextChunk.render(ctx, 0, this.offsetTile + 1, ChunkManager.chunkWidth * ChunkManager.tileSize
            - this.offsetTile * ChunkManager.tileSize
            - this.offset);
        CanvasUtilities.fillStrokeRect(ctx, "#000000", "#000000", ChunkManager.chunkWidth * ChunkManager.tileSize, 0, window.innerWidth, window.innerHeight, 1);
        this.player.render(ctx);
        ctx.font = "18px Inconsolata";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("     Score: " + Math.round(this.score), window.innerWidth - 200, 38);
        if (SaveState.getHighScore() != null) {
            ctx.fillText("High Score: " + Math.round(SaveState.getHighScore()), window.innerWidth - 200, 76);
        }
    };
    Game.prototype.tileInformationFromCoordinate = function (x, y) {
        var row = Math.floor(y / ChunkManager.tileSize);
        var col = Math.floor(x / ChunkManager.tileSize);
        if (row >= ChunkManager.chunkHeight || row < 0 ||
            col >= ChunkManager.chunkWidth || col < 0) {
            return null;
        }
        else {
            col += this.offsetTile;
            if (col >= ChunkManager.chunkWidth) {
                return this.nextChunk
                    .tileArray[row][col - ChunkManager.chunkWidth];
            }
            else {
                return this.currentChunk.tileArray[row][col];
            }
        }
    };
    Game.prototype.restart = function () {
        if (this.score > SaveState.getHighScore()) {
            SaveState.setHighScore(this.score);
        }
        Main.restart();
    };
    return Game;
}());
var GameManager;
(function (GameManager) {
    var TASK_COUNT = 2;
    var tasksComplete = 0;
    function done(callback) {
        tasksComplete += 1;
        if (tasksComplete == TASK_COUNT) {
            callback();
        }
    }
    function init(callback) {
        var doneCallback = function () { return done(callback); };
        Mouse.init();
        Keyboard.init();
        ChunkManager.init(doneCallback);
        SoundManager.init(doneCallback);
    }
    GameManager.init = init;
    function getAssetFile(assetType) {
        return "../assets/" + assetType + ".json";
    }
    GameManager.getAssetFile = getAssetFile;
})(GameManager || (GameManager = {}));
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
    window.ontouchstart = function (event) {
        mouseDown = true;
    };
    window.onmouseup = function (event) {
        mouseDown = false;
    };
    window.ontouchend = function (event) {
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
        this.shouldStop = false;
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
            if (!_this.shouldStop) {
                _this.frameId = window.requestAnimationFrame(_this.loop);
            }
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
        this.shouldStop = true;
    };
    return Looper;
}());
var Main;
(function (Main) {
    var gameCanvas;
    var ctx;
    var looper;
    var player;
    var game;
    function restart() {
        looper.stop();
        loadGame();
        looper.start();
    }
    Main.restart = restart;
    function loadGame() {
        game = new Game(10, 100 * ChunkManager.tileSize);
        player = new Player(game, new BoundingBox(3 * ChunkManager.tileSize, 0, ChunkManager.tileSize, ChunkManager.tileSize), new Vector(0, 0), 30 * ChunkManager.tileSize, 2);
        game.player = player;
        looper = new Looper(1 / 60, game, game, ctx);
    }
    Main.loadGame = loadGame;
    function init() {
        gameCanvas = document.getElementById("game");
        ctx = gameCanvas.getContext("2d");
        var handleResize = function () {
            CanvasUtilities.fitCanvasToWindow(gameCanvas);
            ChunkManager.tileSize = window.innerHeight / ChunkManager.chunkHeight;
        };
        window.onresize = function (event) {
            handleResize();
        };
        handleResize();
        ctx.font;
        loadGame();
        var loadingPanel = document.getElementById("loading-panel");
        var startPanel = document.getElementById("start-panel");
        var startButton = document.getElementById("start-button");
        loadingPanel.style.display = "none";
        startPanel.style.display = "block";
        if (SaveState.getHighScore() != null) {
            var highScoreOutput = document.getElementById("high-score");
            highScoreOutput.innerHTML = "High Score: " +
                Math.round(SaveState.getHighScore());
        }
        startButton.onclick = function (event) {
            startPanel.style.display = "none";
            gameCanvas.style.display = "block";
            looper.start();
        };
    }
    Main.init = init;
    window.onload = function (event) { return GameManager.init(function () { return init(); }); };
})(Main || (Main = {}));
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
                    Math.ceil(this.bb.y / ChunkManager.tileSize)
                        * ChunkManager.tileSize;
            }
            else if (this.velocity.y > 0) {
                this.bb.y =
                    Math.floor(this.bb.bottom() / ChunkManager.tileSize)
                        * ChunkManager.tileSize - this.bb.height;
                this.grounded = true;
                this.jumpsLeft = this.maxJumps;
            }
            this.velocity.y = 0;
        }
        this.handleInput();
        var currentTileInfo = this.game.tileInformationFromCoordinate(this.bb.x + this.bb.width / 2, this.bb.y + this.bb.height / 2);
        if (this.bb.y > window.innerHeight ||
            (currentTileInfo != null && currentTileInfo.isBlocked())) {
            this.die();
        }
    };
    Player.prototype.render = function (ctx) {
        CanvasUtilities.fillStrokeRect(ctx, "#00C6FF", "#FFFFFF", this.bb.x, this.bb.y, this.bb.width, this.bb.height, 1);
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
        SoundManager.jump.play();
        this.velocity.y = -this.jumpPower;
        this.jumpsLeft -= 1;
    };
    Player.prototype.die = function () {
        SoundManager.death.play();
        this.game.restart();
    };
    Player.collisionModifiers = [0, 0.5, 1];
    return Player;
}());
var SaveState;
(function (SaveState) {
    function setHighScore(score) {
        window.localStorage.setItem("highScore", "" + score);
    }
    SaveState.setHighScore = setHighScore;
    function getHighScore() {
        return window.localStorage.getItem("highScore");
    }
    SaveState.getHighScore = getHighScore;
})(SaveState || (SaveState = {}));
var SoundManager;
(function (SoundManager) {
    var ASSET_TYPE = "sounds";
    function loadAudio(response, name) {
        var audioData = response[name];
        var audio = new Audio(audioData["path"]);
        audio.loop = audioData["loop"];
        audio.volume = audioData["volume"];
        return audio;
    }
    function init(callback) {
        var soundRequest = new XMLHttpRequest();
        soundRequest.onload = function () {
            var response = JSON.parse(this.responseText);
            SoundManager.background = loadAudio(response, "background");
            SoundManager.jump = loadAudio(response, "jump");
            SoundManager.death = loadAudio(response, "death");
            callback();
        };
        soundRequest.open("GET", GameManager.getAssetFile(ASSET_TYPE), true);
        soundRequest.send();
    }
    SoundManager.init = init;
})(SoundManager || (SoundManager = {}));
var CanvasUtilities;
(function (CanvasUtilities) {
    function fitCanvasToWindow(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    CanvasUtilities.fitCanvasToWindow = fitCanvasToWindow;
    function fillStrokeRect(ctx, fillStyle, strokeStyle, x, y, width, height, lineWidth) {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }
    CanvasUtilities.fillStrokeRect = fillStrokeRect;
    function clear(ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    CanvasUtilities.clear = clear;
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
