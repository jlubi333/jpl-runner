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
        for (var row = 0; row < this.tileArray.length; row++) {
            for (var col = 0; col < this.tileArray[row].length; col++) {
            }
        }
    };
    Chunk.prototype.render = function (ctx) {
        this.partialRender(ctx, 0, this.tileArray[0].length, 0);
    };
    // Renders from leftBound (inclusive) to rightBound (exclusive) with offset
    Chunk.prototype.partialRender = function (ctx, leftBound, rightBound, offset) {
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
        ChunkManager.chunks = [];
        ChunkManager.chunks.push(new Chunk(TileInformation.loadFromIdArray(idArray1)));
        ChunkManager.chunks.push(new Chunk(TileInformation.loadFromIdArray(idArray2)));
        ChunkManager.chunks.push(new Chunk(TileInformation.loadFromIdArray(idArray3)));
    }
    ChunkManager.init = init;
    function randomChunk() {
        return MathUtilities.randSelection(ChunkManager.chunks);
    }
    ChunkManager.randomChunk = randomChunk;
})(ChunkManager || (ChunkManager = {}));
var Game = (function () {
    function Game(tileSpeed) {
        this.tileSpeed = tileSpeed;
        this.offset = 0;
        this.offsetTile = 0;
        this.currentChunk = ChunkManager.randomChunk();
        this.nextChunk = ChunkManager.randomChunk();
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
            this.nextChunk = ChunkManager.randomChunk();
        }
    };
    Game.prototype.render = function (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.currentChunk
            .partialRender(ctx, this.offsetTile, ChunkManager.CHUNK_WIDTH, -this.offsetTile * ChunkManager.TILE_SIZE - this.offset);
        this.nextChunk
            .partialRender(ctx, 0, this.offsetTile + 1, ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE - this.offsetTile * ChunkManager.TILE_SIZE - this.offset);
        // TODO remove world bound indicator
        ctx.fillStyle = "red";
        ctx.fillRect(ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE, 0, 10000, 10000);
    };
    return Game;
}());
var Mouse;
(function (Mouse) {
    function init(pos) {
        if (pos === void 0) { pos = new Vector(window.innerWidth / 2, window.innerHeight / 2); }
        Mouse.pos = pos;
    }
    Mouse.init = init;
})(Mouse || (Mouse = {}));
window.onmousemove = function (event) {
    Mouse.pos.x = event.pageX;
    Mouse.pos.y = event.pageY;
};
var Keyboard;
(function (Keyboard) {
    Keyboard.KEYBOARD_MAP = [
        "",
        "",
        "",
        "CANCEL",
        "",
        "",
        "HELP",
        "",
        "BACK_SPACE",
        "TAB",
        "",
        "",
        "CLEAR",
        "ENTER",
        "ENTER_SPECIAL",
        "",
        "SHIFT",
        "CONTROL",
        "ALT",
        "PAUSE",
        "CAPS_LOCK",
        "KANA",
        "EISU",
        "JUNJA",
        "FINAL",
        "HANJA",
        "",
        "ESCAPE",
        "CONVERT",
        "NONCONVERT",
        "ACCEPT",
        "MODECHANGE",
        "SPACE",
        "PAGE_UP",
        "PAGE_DOWN",
        "END",
        "HOME",
        "LEFT",
        "UP",
        "RIGHT",
        "DOWN",
        "SELECT",
        "PRINT",
        "EXECUTE",
        "PRINTSCREEN",
        "INSERT",
        "DELETE",
        "",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "COLON",
        "SEMICOLON",
        "LESS_THAN",
        "EQUALS",
        "GREATER_THAN",
        "QUESTION_MARK",
        "AT",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "OS_KEY",
        "",
        "CONTEXT_MENU",
        "",
        "SLEEP",
        "NUMPAD0",
        "NUMPAD1",
        "NUMPAD2",
        "NUMPAD3",
        "NUMPAD4",
        "NUMPAD5",
        "NUMPAD6",
        "NUMPAD7",
        "NUMPAD8",
        "NUMPAD9",
        "MULTIPLY",
        "ADD",
        "SEPARATOR",
        "SUBTRACT",
        "DECIMAL",
        "DIVIDE",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "F13",
        "F14",
        "F15",
        "F16",
        "F17",
        "F18",
        "F19",
        "F20",
        "F21",
        "F22",
        "F23",
        "F24",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "NUM_LOCK",
        "SCROLL_LOCK",
        "WIN_OEM_FJ_JISHO",
        "WIN_OEM_FJ_MASSHOU",
        "WIN_OEM_FJ_TOUROKU",
        "WIN_OEM_FJ_LOYA",
        "WIN_OEM_FJ_ROYA",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "CIRCUMFLEX",
        "EXCLAMATION",
        "DOUBLE_QUOTE",
        "HASH",
        "DOLLAR",
        "PERCENT",
        "AMPERSAND",
        "UNDERSCORE",
        "OPEN_PAREN",
        "CLOSE_PAREN",
        "ASTERISK",
        "PLUS",
        "PIPE",
        "HYPHEN_MINUS",
        "OPEN_CURLY_BRACKET",
        "CLOSE_CURLY_BRACKET",
        "TILDE",
        "",
        "",
        "",
        "",
        "VOLUME_MUTE",
        "VOLUME_DOWN",
        "VOLUME_UP",
        "",
        "",
        "SEMICOLON",
        "EQUALS",
        "COMMA",
        "MINUS",
        "PERIOD",
        "SLASH",
        "BACK_QUOTE",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "OPEN_BRACKET",
        "BACK_SLASH",
        "CLOSE_BRACKET",
        "QUOTE",
        "",
        "META",
        "ALTGR",
        "",
        "WIN_ICO_HELP",
        "WIN_ICO_00",
        "",
        "WIN_ICO_CLEAR",
        "",
        "",
        "WIN_OEM_RESET",
        "WIN_OEM_JUMP",
        "WIN_OEM_PA1",
        "WIN_OEM_PA2",
        "WIN_OEM_PA3",
        "WIN_OEM_WSCTRL",
        "WIN_OEM_CUSEL",
        "WIN_OEM_ATTN",
        "WIN_OEM_FINISH",
        "WIN_OEM_COPY",
        "WIN_OEM_AUTO",
        "WIN_OEM_ENLW",
        "WIN_OEM_BACKTAB",
        "ATTN",
        "CRSEL",
        "EXSEL",
        "EREOF",
        "PLAY",
        "ZOOM",
        "",
        "PA1",
        "WIN_OEM_CLEAR",
        "" // [255]
    ];
    function init() {
        this.keysDown = {};
    }
    Keyboard.init = init;
    function isKeyDown(keyCode) {
        // Cannot just return Keyboard.keys[keyCode] because it may be null
        return Keyboard.keysDown[keyCode] == true;
    }
    Keyboard.isKeyDown = isKeyDown;
})(Keyboard || (Keyboard = {}));
window.onkeydown = function (event) {
    Keyboard.keysDown[event.keyCode] = true;
};
window.onkeyup = function (event) {
    Keyboard.keysDown[event.keyCode] = false;
};
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
    var game = new Game(5);
    var looper = new Looper(1 / 60, game, game, ctx);
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
