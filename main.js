var CanvasUtilities;
(function (CanvasUtilities) {
    function hiResCanvasResize(canvas, width, height) {
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    CanvasUtilities.hiResCanvasResize = hiResCanvasResize;
    function fitCanvasToWindow(canvas) {
        hiResCanvasResize(canvas, window.innerWidth, window.innerHeight);
    }
    CanvasUtilities.fitCanvasToWindow = fitCanvasToWindow;
    function scaledRect(ctx, fillStyle, strokeStyle, x, y, width, height, lineWidth) {
        var scx = Scale.convert(x);
        var scy = Scale.convert(y);
        var scw = Scale.convert(width);
        var sch = Scale.convert(height);
        var sclw = Scale.convert(lineWidth);
        ctx.fillStyle = fillStyle;
        ctx.fillRect(scx, scy, scw, sch);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = sclw;
        ctx.strokeRect(scx, scy, scw, sch);
    }
    CanvasUtilities.scaledRect = scaledRect;
    function clear(ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    CanvasUtilities.clear = clear;
})(CanvasUtilities || (CanvasUtilities = {}));
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
                CanvasUtilities.scaledRect(ctx, tileInfo.getFillStyle(), tileInfo.getStrokeStyle(), col + offset, row, 1, 1, 1 / Scale.scale);
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
    function Game(initialTileSpeed, speedMultiplier, gravity, chunkRenderDistance) {
        this.initialTileSpeed = initialTileSpeed;
        this.speedMultiplier = speedMultiplier;
        this.gravity = gravity;
        this.offset = 0;
        this.offsetTile = 0;
        this.score = 0;
        this.tileSpeed = this.initialTileSpeed;
        this.chunkQueue = [];
        for (var i = 0; i < chunkRenderDistance; i++) {
            this.chunkQueue.push(ChunkManager.generateRandomChunk());
        }
    }
    Game.prototype.update = function (dt) {
        this.tileSpeed += this.speedMultiplier * dt;
        this.score += 100 * dt;
        this.offset += this.tileSpeed * dt;
        if (this.offset >= 1) {
            this.offset -= 1;
            this.offsetTile += 1;
        }
        if (this.offsetTile >= ChunkManager.chunkWidth) {
            this.offsetTile = 0;
            this.shiftChunks();
        }
        this.player.update(dt);
    };
    Game.prototype.render = function (ctx) {
        CanvasUtilities.clear(ctx);
        for (var i = 0; i < this.chunkQueue.length; i++) {
            this.chunkQueue[i].render(ctx, 0, ChunkManager.chunkWidth, i * ChunkManager.chunkWidth
                - this.offsetTile
                - this.offset);
        }
        this.player.render(ctx);
        ScoreUtilities.displayScore(this.score);
        if (SaveState.getHighScore() != null) {
            ScoreUtilities.displayHighScore();
        }
    };
    Game.prototype.tileInformationFromCoordinate = function (x, y) {
        var row = Math.floor(y);
        var col = Math.floor(x);
        if (row >= ChunkManager.chunkHeight || row < 0 ||
            col >= ChunkManager.chunkWidth || col < 0) {
            return null;
        }
        else {
            col += this.offsetTile;
            if (col >= ChunkManager.chunkWidth) {
                return this.getNextChunk()
                    .tileArray[row][col - ChunkManager.chunkWidth];
            }
            else {
                return this.getHeadChunk().tileArray[row][col];
            }
        }
    };
    Game.prototype.restart = function () {
        if (this.score > SaveState.getHighScore()) {
            SaveState.setHighScore(this.score);
        }
        Main.restart();
    };
    Game.prototype.getHeadChunk = function () {
        return this.chunkQueue[0];
    };
    Game.prototype.getNextChunk = function () {
        return this.chunkQueue[1];
    };
    Game.prototype.shiftChunks = function () {
        for (var i = 0; i < this.chunkQueue.length - 1; i++) {
            this.chunkQueue[i] = this.chunkQueue[i + 1];
        }
        this.chunkQueue[this.chunkQueue.length - 1] =
            ChunkManager.generateRandomChunk();
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
        ScoreUtilities.init();
        ChunkManager.init(doneCallback);
        SoundManager.init(doneCallback);
    }
    GameManager.init = init;
    function getAssetFile(assetType) {
        // The generated JavaScript file will be in the root directory, so this
        // is relative to that.
        return "assets/" + assetType + ".json";
    }
    GameManager.getAssetFile = getAssetFile;
})(GameManager || (GameManager = {}));
var Mouse;
(function (Mouse) {
    var mouseDown;
    function handle(parentElement, initialPos) {
        if (initialPos === void 0) { initialPos = new Vector(window.innerWidth / 2, window.innerHeight / 2); }
        Mouse.pos = initialPos;
        mouseDown = false;
        parentElement.addEventListener("mousemove", function (event) {
            Mouse.pos.x = event.pageX;
            Mouse.pos.y = event.pageY;
        });
        parentElement.addEventListener("mousedown", function (event) {
            mouseDown = true;
        });
        parentElement.addEventListener("touchstart", function (event) {
            mouseDown = true;
        });
        parentElement.addEventListener("mouseup", function (event) {
            mouseDown = false;
        });
        parentElement.addEventListener("touchend", function (event) {
            mouseDown = false;
        });
    }
    Mouse.handle = handle;
    function isMouseDown() {
        return mouseDown;
    }
    Mouse.isMouseDown = isMouseDown;
})(Mouse || (Mouse = {}));
var Keyboard;
(function (Keyboard) {
    var keysDown = {};
    function isKeyDown(keyCode) {
        // Cannot just return Keyboard.keys[keyCode] because it may be null
        return keysDown[keyCode] == true;
    }
    Keyboard.isKeyDown = isKeyDown;
    window.addEventListener("keydown", function (event) {
        keysDown[event.keyCode] = true;
    });
    window.addEventListener("keyup", function (event) {
        keysDown[event.keyCode] = false;
    });
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
        game = new Game(10, 0.5, 100, 4);
        player = new Player(game, new BoundingBox(3, -1, 1, 1), new Vector(0, 0), 30, 2);
        game.player = player;
        looper = new Looper(1 / 60, game, game, ctx);
    }
    Main.loadGame = loadGame;
    function init() {
        gameCanvas = document.getElementById("game");
        ctx = gameCanvas.getContext("2d");
        var handleResize = function () {
            CanvasUtilities.fitCanvasToWindow(gameCanvas);
            Scale.scale = window.innerHeight / ChunkManager.chunkHeight;
        };
        window.addEventListener("resize", function (event) {
            handleResize();
        });
        handleResize();
        Mouse.handle(gameCanvas);
        ctx.font;
        loadGame();
        var loadingPanel = document.getElementById("loading-panel");
        var startPanel = document.getElementById("start-panel");
        var startButton = document.getElementById("start-button");
        var gameInfo = document.getElementById("game-info");
        loadingPanel.style.display = "none";
        startPanel.style.display = "block";
        if (SaveState.getHighScore() != null) {
            ScoreUtilities.displayHighScore();
        }
        startButton.onclick = function (event) {
            startPanel.style.display = "none";
            gameInfo.style.display = "block";
            gameCanvas.style.display = "block";
            SoundManager.mobileInit();
            SoundManager.background.play();
            looper.start();
        };
    }
    Main.init = init;
    window.addEventListener("load", function (event) { return GameManager.init(function () { return init(); }); });
    function blur() {
        SoundManager.blur();
    }
    function focus() {
        SoundManager.focus();
    }
    window.addEventListener("blur", function (event) { return blur(); });
    window.addEventListener("focus", function (event) { return focus(); });
    window.addEventListener("visibilitychange", function (event) {
        if (document.hidden) {
            blur();
        }
        else {
            focus();
        }
    });
    var M_KEY = 77;
    window.addEventListener("keydown", function (event) {
        if (event.keyCode == M_KEY) {
            SoundManager.toggleMute();
        }
    });
})(Main || (Main = {}));
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
                this.bb.y = Math.ceil(this.bb.y);
            }
            else if (this.velocity.y > 0) {
                this.bb.y = Math.floor(this.bb.bottom()) - this.bb.height;
                this.grounded = true;
                this.jumpsLeft = this.maxJumps;
            }
            this.velocity.y = 0;
        }
        this.handleInput();
        var currentTileInfo = this.game.tileInformationFromCoordinate(this.bb.x + this.bb.width / 2, this.bb.y + this.bb.height / 2);
        if (Scale.convert(this.bb.y) > window.innerHeight ||
            (currentTileInfo != null && currentTileInfo.isBlocked())) {
            this.die();
        }
    };
    Player.prototype.render = function (ctx) {
        CanvasUtilities.scaledRect(ctx, "#00C6FF", "#FFFFFF", this.bb.x, this.bb.y, this.bb.width, this.bb.height, 1 / Scale.scale);
    };
    Player.prototype.collidesWithMap = function (d) {
        var tileInfo;
        var modifier;
        for (var i = 0; i < 3; i++) {
            modifier = Player.collisionModifiers[i];
            if (d == CollisionDirection.X) {
                // Can only be moving right
                tileInfo = this.game.tileInformationFromCoordinate(this.bb.right(), this.bb.y + this.bb.height * modifier);
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
    Player.collisionModifiers = [0.01, 0.5, 0.99];
    return Player;
}());
var SaveState;
(function (SaveState) {
    var VERSION = "1";
    function setHighScore(score) {
        window.localStorage.setItem("highScore" + VERSION, "" + score);
    }
    SaveState.setHighScore = setHighScore;
    function getHighScore() {
        return window.localStorage.getItem("highScore" + VERSION);
    }
    SaveState.getHighScore = getHighScore;
    function setMute(mute) {
        window.localStorage.setItem("mute", mute ? "1" : "0");
    }
    SaveState.setMute = setMute;
    function getMute() {
        return window.localStorage.getItem("mute") == "1";
    }
    SaveState.getMute = getMute;
})(SaveState || (SaveState = {}));
var Scale;
(function (Scale) {
    function convert(a) {
        return a * Scale.scale;
    }
    Scale.convert = convert;
})(Scale || (Scale = {}));
var ScoreUtilities;
(function (ScoreUtilities) {
    var scoreOutputs;
    var highScoreOutputs;
    function init() {
        scoreOutputs = document.getElementsByClassName("score");
        highScoreOutputs = document.getElementsByClassName("high-score");
    }
    ScoreUtilities.init = init;
    function displayScore(score) {
        var scoreString = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Score: " +
            Math.round(score);
        for (var i = 0; i < scoreOutputs.length; i++) {
            scoreOutputs[i].innerHTML = scoreString;
        }
    }
    ScoreUtilities.displayScore = displayScore;
    function displayHighScore() {
        var highScoreString = "High Score: " + Math.round(SaveState.getHighScore());
        for (var i = 0; i < highScoreOutputs.length; i++) {
            highScoreOutputs[i].innerHTML = highScoreString;
        }
    }
    ScoreUtilities.displayHighScore = displayHighScore;
})(ScoreUtilities || (ScoreUtilities = {}));
var SoundManager;
(function (SoundManager) {
    var muteButton;
    var muted;
    var volumeBackups = {};
    var ASSET_TYPE = "sounds";
    function loadAudio(response, name) {
        var audioData = response[name];
        var audio = new Audio(audioData["path"]);
        audio.loop = audioData["loop"];
        audio.volume = audioData["volume"];
        volumeBackups[name] = audio.volume;
        return audio;
    }
    function init(callback) {
        var soundRequest = new XMLHttpRequest();
        soundRequest.onload = function () {
            var response = JSON.parse(this.responseText);
            SoundManager.background = loadAudio(response, "background");
            SoundManager.jump = loadAudio(response, "jump");
            SoundManager.death = loadAudio(response, "death");
            muteButton = document.getElementById("mute-button");
            muteButton.onclick = function (event) {
                toggleMute();
            };
            if (SaveState.getMute()) {
                muteButton.click();
            }
            callback();
        };
        soundRequest.open("GET", GameManager.getAssetFile(ASSET_TYPE), true);
        soundRequest.send();
    }
    SoundManager.init = init;
    function toggleMute() {
        if (muted) {
            unmute();
            muteButton.innerHTML = "Mute";
        }
        else {
            mute();
            muteButton.innerHTML = "Unmute";
        }
    }
    SoundManager.toggleMute = toggleMute;
    /*
     * Note: *MUST* be called from within user click function stack
     */
    function mobileInit() {
        SoundManager.background.play();
        stopSound(SoundManager.background);
        SoundManager.jump.play();
        stopSound(SoundManager.jump);
        SoundManager.death.play();
        stopSound(SoundManager.death);
    }
    SoundManager.mobileInit = mobileInit;
    function blur() {
        SoundManager.background.pause();
        stopSound(SoundManager.death);
        stopSound(SoundManager.jump);
    }
    SoundManager.blur = blur;
    function focus() {
        SoundManager.background.play();
    }
    SoundManager.focus = focus;
    function stopSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }
    SoundManager.stopSound = stopSound;
    function mute() {
        SoundManager.background.volume = 0;
        SoundManager.jump.volume = 0;
        SoundManager.death.volume = 0;
        muted = true;
        SaveState.setMute(true);
    }
    function unmute() {
        SoundManager.background.volume = volumeBackups["background"];
        SoundManager.jump.volume = volumeBackups["jump"];
        SoundManager.death.volume = volumeBackups["death"];
        muted = false;
        SaveState.setMute(false);
    }
})(SoundManager || (SoundManager = {}));
