class Game implements Updatable, Renderable {
    private offset: number = 0;
    private offsetTile: number = 0;
    private currentChunk: Chunk;
    private nextChunk: Chunk;
    private tileSpeed: number;
    private score: number = 0;

    public player: Player;

    constructor(private initialTileSpeed: number,
                public speedMultiplier: number,
                public gravity: number) {
        this.tileSpeed = this.initialTileSpeed;
        this.currentChunk = ChunkManager.generateRandomChunk();
        this.nextChunk = ChunkManager.generateRandomChunk();
        SoundManager.background.play();
    }

    public update(dt: number): void {
        this.tileSpeed += this.speedMultiplier * dt;
        this.score += 100 * dt;

        this.offset += this.tileSpeed * dt;
        if (this.offset >= 1) {
            this.offset -= 1;
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
                                 -this.offsetTile - this.offset);
        this.nextChunk.render(ctx,
                              0,
                              ChunkManager.chunkWidth,
                              ChunkManager.chunkWidth
                                  - this.offsetTile
                                  - this.offset);

        this.player.render(ctx);


        ScoreUtilities.displayScore(this.score);
        if (SaveState.getHighScore() != null) {
            ScoreUtilities.displayHighScore();
        }
    }

    public tileInformationFromCoordinate(x: number,
                                         y: number): TileInformation {
        let row = Math.floor(y);
        let col = Math.floor(x);

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
