class Player implements Updatable, Renderable {
    constructor(public position: Vector, public velocity: Vector) {}

    public update(dt: number): void {
    }

    public render(ctx: CanvasRenderingContext2D): void {
    }
}
