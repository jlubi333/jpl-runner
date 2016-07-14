let idArray1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let idArray2 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let idArray3 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

class TileInformation {
    private static tileFillStyleMap: {[id: number]: string} = {
        0: "white",
        1: "black"
    };
    private static tileBlockedMap: {[id: number]: boolean} = {
        0: false,
        1: true
    };

    constructor(public id: number) {}

    public static loadFromIdArray(idArray: number[][]): TileInformation[][] {
        let tileArray: TileInformation[][] = [];
        for (let row = 0; row < idArray.length; row++) {
            tileArray.push([]);
            for (let col = 0; col < idArray[row].length; col++) {
                tileArray[tileArray.length - 1].push(
                    new TileInformation(idArray[row][col])
                );
            }
        }
        return tileArray;
    }

    public getFillStyle(): string {
        return TileInformation.tileFillStyleMap[this.id];
    }

    public isBlocked(): boolean {
        return TileInformation.tileBlockedMap[this.id];
    }
}

class Chunk implements Updatable, Renderable {
    constructor(public tileArray: TileInformation[][]) {}

    public update(dt: number): void {
        for (let row = 0; row < this.tileArray.length; row++) {
            for (let col = 0; col < this.tileArray[row].length; col++) {
            }
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        this.partialRender(ctx, 0, this.tileArray[0].length, 0);
    }

    // Renders from leftBound (inclusive) to rightBound (exclusive) with offset
    public partialRender(ctx: CanvasRenderingContext2D,
                         leftBound: number,
                         rightBound: number,
                         offset: number): void {
        for (let row = 0; row < this.tileArray.length; row++) {
            for (let col = leftBound; col < rightBound; col++) {
                let tileInfo = this.tileArray[row][col];
                ctx.fillStyle = tileInfo.getFillStyle();
                ctx.fillRect(col * ChunkManager.TILE_SIZE + offset,
                             row * ChunkManager.TILE_SIZE,
                             ChunkManager.TILE_SIZE,
                             ChunkManager.TILE_SIZE);
            }
        }
    }
}

namespace ChunkManager {
    export const CHUNK_WIDTH = 20;
    export const CHUNK_HEIGHT = 8;
    export const TILE_SIZE = 32;

    export let chunks: Chunk[];

    export function init() {
        ChunkManager.chunks = [];
        ChunkManager.chunks.push(new Chunk(
            TileInformation.loadFromIdArray(idArray1)
        ));
        ChunkManager.chunks.push(new Chunk(
            TileInformation.loadFromIdArray(idArray2)
        ));
        ChunkManager.chunks.push(new Chunk(
            TileInformation.loadFromIdArray(idArray3)
        ));
    }

    export function randomChunk(): Chunk {
        return MathUtilities.randSelection(ChunkManager.chunks);
    }
}
