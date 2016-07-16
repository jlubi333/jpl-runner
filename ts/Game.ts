class Game implements Updatable, Renderable {
    private offset: number = 0;
    private offsetTile: number = 0;
    private currentChunk: Chunk;
    private nextChunk: Chunk;
    private score: number = 0;

    public player: Player;

    constructor(public tileSpeed: number,
                public gravity: number) {
        this.currentChunk = ChunkManager.generateRandomChunk();
        this.nextChunk = ChunkManager.generateRandomChunk();
        SoundManager.background.play();
    }

    public update(dt: number): void {
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
    }

    public render(ctx: CanvasRenderingContext2D): void {
        CanvasUtilities.clear(ctx);

        this.currentChunk.render(ctx,
                                 this.offsetTile,
                                 ChunkManager.chunkWidth,
                                 -this.offsetTile * ChunkManager.tileSize
                                     - this.offset);
        this.nextChunk.render(ctx,
                              0,
                              this.offsetTile + 1,
                              ChunkManager.chunkWidth * ChunkManager.tileSize
                                  - this.offsetTile * ChunkManager.tileSize
                                  - this.offset);

        CanvasUtilities.fillStrokeRect(
            ctx,
            "#000000",
            "#000000",
            ChunkManager.chunkWidth * ChunkManager.tileSize,
            0,
            window.innerWidth,
            window.innerHeight,
            1
        );

        this.player.render(ctx);

        ctx.font = "18px Inconsolata";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText("     Score: " + Math.round(this.score),
                     window.innerWidth - 200,
                     38);
        if (SaveState.getHighScore() != null) {
            ctx.fillText("High Score: " + Math.round(SaveState.getHighScore()),
                         window.innerWidth - 200,
                         76);
        }
    }

    public tileInformationFromCoordinate(x: number,
                                         y: number): TileInformation {
        let row = Math.floor(y / ChunkManager.tileSize);
        let col = Math.floor(x / ChunkManager.tileSize);

        if (row >= ChunkManager.chunkHeight || row < 0 ||
            col >= ChunkManager.chunkWidth || col < 0) {
            return null;
        } else {
            col += this.offsetTile;
            if (col >= ChunkManager.chunkWidth) {
                return this.nextChunk
                           .tileArray[row][col - ChunkManager.chunkWidth];
            }
            else {
                return this.currentChunk.tileArray[row][col];
            }
        }
    }

    public restart(): void {
        if (this.score > SaveState.getHighScore()) {
            SaveState.setHighScore(this.score);
        }
        Main.restart();
    }
}
