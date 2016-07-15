class Looper {
    private fixedTimestepMs: number;
    private frameId: number;
    private previousTimestamp: number;
    private unsimulatedTime: number = 0;
    private shouldStop = false;

    constructor(private fixedTimestep: number,
                private updatable: Updatable,
                private renderable: Renderable,
                private ctx: CanvasRenderingContext2D) {
        this.fixedTimestepMs = 1000 * this.fixedTimestep;
    }

    // Captures "this" correctly for requestAnimationFrame
    private loop = (timestamp: number) => {
        const deltaTimestamp = timestamp - this.previousTimestamp;
        this.unsimulatedTime += deltaTimestamp;
        this.previousTimestamp = timestamp;

        let updateCount = 0;
        while (this.unsimulatedTime >= this.fixedTimestepMs) {
            this.updatable.update(this.fixedTimestep);
            this.unsimulatedTime -= this.fixedTimestepMs;
            updateCount += 1;
            if (updateCount >= 10) {
                this.unsimulatedTime = 0;
                break;
            }
        }

        if (updateCount > 0) {
            this.renderable.render(this.ctx);
        }

        if (!this.shouldStop) {
            this.frameId = window.requestAnimationFrame(this.loop);
        }
    }

    public start(): void {
        this.frameId = window.requestAnimationFrame((timestamp) => {
            this.previousTimestamp = timestamp;
            this.frameId = window.requestAnimationFrame(this.loop);
        });
    }

    public stop(): void {
        this.shouldStop = true;
    }
}
