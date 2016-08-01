class Game implements Updatable, Renderable {
    private offset: number = 0;
    private offsetTile: number = 0;
    private chunkQueue: Chunk[];
    private tileSpeed: number;
    private score: number = 0;

    public player: Player;

    constructor(private initialTileSpeed: number,
                public speedMultiplier: number,
                public gravity: number,
                chunkRenderDistance: number) {
        this.tileSpeed = this.initialTileSpeed;
        this.chunkQueue = [];
        for (let i = 0; i < chunkRenderDistance; i++) {
            this.chunkQueue.push(ChunkManager.generateRandomChunk());
        }
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
            this.shiftChunks();
        }

        this.player.update(dt);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        CanvasUtilities.clear(ctx);

        for (let i = 0; i < this.chunkQueue.length; i++) {
            this.chunkQueue[i].render(ctx,
                                     0,
                                     ChunkManager.chunkWidth,
                                     i * ChunkManager.chunkWidth
                                         - this.offsetTile
                                         - this.offset);
        }

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
                return this.getNextChunk()
                           .tileArray[row][col - ChunkManager.chunkWidth];
            }
            else {
                return this.getHeadChunk().tileArray[row][col];
            }
        }
    }

    public restart(): void {
        if (this.score > SaveState.getHighScore()) {
            SaveState.setHighScore(this.score);
        }
        Main.restart();
    }

    private getHeadChunk(): Chunk {
        return this.chunkQueue[0];
    }

    private getNextChunk(): Chunk {
        return this.chunkQueue[1];
    }

    private shiftChunks(): void {
        for (let i = 0; i < this.chunkQueue.length - 1; i++) {
            this.chunkQueue[i] = this.chunkQueue[i + 1];
        }
        this.chunkQueue[this.chunkQueue.length - 1] =
            ChunkManager.generateRandomChunk()
    }
}
