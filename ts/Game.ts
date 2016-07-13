class Game implements Updatable, Renderable {
    private offset = 0;
    private offsetTile = 0;

    constructor(public tileSpeed: number,
                public tileSize: number) {}

    public update(dt: number): void {
        this.offset += this.tileSpeed * this.tileSize * dt;
        if (this.offset >= this.tileSize) {
            this.offset -= this.tileSize;
            this.offsetTile += 1;
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const ro = Math.round(this.offset);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 10; col++) {
                let nc = col + this.offsetTile;
                if (currentChunk[row][nc % 20]) {
                    ctx.fillRect(col * this.tileSize - ro, row * this.tileSize, this.tileSize, this.tileSize);
                }
            }
            if (currentChunk[row][(10+this.offsetTile)%20]) {
                ctx.fillRect(10 * this.tileSize - ro, row * this.tileSize, ro, this.tileSize);
            }
        }
        ctx.fillRect(this.tileSize, 4*this.tileSize, this.tileSize, this.tileSize);
    }
}
