namespace CanvasUtilities {
    export function fitCanvasToWindow(canvas: HTMLCanvasElement): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    export function fillStrokeRect(ctx: CanvasRenderingContext2D,
                                   fillStyle: string,
                                   strokeStyle: string,
                                   x: number,
                                   y: number,
                                   width: number,
                                   height: number,
                                   lineWidth: number): void {
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(x, y, width, height);
    }

    export function clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

namespace MathUtilities {
    // Returns a random integer in the range [min, max).
    export function randInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    export function randSelection<T>(array: T[]): T {
        return array[randInt(0, array.length)];
    }
}

