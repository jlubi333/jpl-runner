interface Updatable {
    update(dt: number): void;
}

interface Renderable {
    render(ctx: CanvasRenderingContext2D): void;
}
