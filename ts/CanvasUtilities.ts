namespace CanvasUtilities {
    export function hiResCanvasResize(canvas: HTMLCanvasElement,
                                      width: number,
                                      height: number) {
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.getContext("2d").scale(
            window.devicePixelRatio, window.devicePixelRatio
        );
    }

    export function fitCanvasToWindow(canvas: HTMLCanvasElement): void {
        hiResCanvasResize(canvas, window.innerWidth, window.innerHeight);
    }

    export function scaledRect(ctx: CanvasRenderingContext2D,
                               fillStyle: string,
                               strokeStyle: string,
                               x: number,
                               y: number,
                               width: number,
                               height: number,
                               lineWidth: number): void {
        let scx = Scale.convert(x);
        let scy = Scale.convert(y);
        let scw = Scale.convert(width);
        let sch = Scale.convert(height);
        let sclw = Scale.convert(lineWidth);
        ctx.fillStyle = fillStyle;
        ctx.fillRect(scx, scy, scw, sch);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = sclw;
        ctx.strokeRect(scx, scy, scw, sch);
    }

    export function clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
