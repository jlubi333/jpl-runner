class Game implements Updatable, Renderable {
    private offset: number = 0;
    private offsetTile: number = 0;
    private currentChunk: Chunk;
    private nextChunk: Chunk;

    public player: Player;

    constructor(public tileSpeed: number,
                public gravity: number) {
        this.currentChunk = ChunkManager.generateRandomChunk();
        this.nextChunk = ChunkManager.generateRandomChunk();
    }

    public update(dt: number): void {
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
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.currentChunk.render(ctx,
                                 this.offsetTile,
                                 ChunkManager.CHUNK_WIDTH,
                                 -this.offsetTile * ChunkManager.TILE_SIZE
                                     - this.offset);
        this.nextChunk.render(ctx,
                              0,
                              this.offsetTile + 1,
                              ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE
                                  - this.offsetTile * ChunkManager.TILE_SIZE
                                  - this.offset);

        // TODO remove world bound indicator
        ctx.fillStyle = "rgba(255, 0, 0, 0.9)"
        ctx.fillRect(ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE, 0, 10000, 10000);

        this.player.render(ctx);
    }

    public tileInformationFromCoordinate(x: number,
                                         y: number): TileInformation {
        let row = Math.floor(y / ChunkManager.TILE_SIZE);
        let col = Math.floor(x / ChunkManager.TILE_SIZE);

        if (row >= ChunkManager.CHUNK_HEIGHT || row < 0 ||
            col >= ChunkManager.CHUNK_WIDTH || col < 0) {
            return null;
        } else {
            col += this.offsetTile;
            if (col >= ChunkManager.CHUNK_WIDTH) {
                return this.nextChunk
                           .tileArray[row][col - ChunkManager.CHUNK_WIDTH];
            }
            else {
                return this.currentChunk.tileArray[row][col];
            }
        }
    }
}
