class Game implements Updatable, Renderable {
    private offset: number = 0;
    private offsetTile: number = 0;
    private currentChunk: Chunk;
    private nextChunk: Chunk;

    constructor(public tileSpeed: number) {
        this.currentChunk = ChunkManager.randomChunk();
        this.nextChunk = ChunkManager.randomChunk();
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
            this.nextChunk = ChunkManager.randomChunk();
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.currentChunk
            .partialRender(ctx,
                           this.offsetTile,
                           ChunkManager.CHUNK_WIDTH,
                           -this.offsetTile * ChunkManager.TILE_SIZE - this.offset);
        this.nextChunk
            .partialRender(ctx,
                           0,
                           this.offsetTile + 1,
                           ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE - this.offsetTile * ChunkManager.TILE_SIZE - this.offset);

        // TODO remove world bound indicator
        ctx.fillStyle = "red"
        ctx.fillRect(ChunkManager.CHUNK_WIDTH * ChunkManager.TILE_SIZE, 0, 10000, 10000);
    }
}
