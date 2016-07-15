let idArray1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

let idArray2 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

let idArray3 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
];

class TileInformation {
    private static tileFillStyleMap: {[id: number]: string} = {
        0: "#000000",
        1: "#333333"
    };
    private static tileStrokeStyleMap: {[id: number]: string} = {
        0: "#000000",
        1: "#222222"
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

    public getStrokeStyle(): string {
        return TileInformation.tileStrokeStyleMap[this.id];
    }

    public isBlocked(): boolean {
        return TileInformation.tileBlockedMap[this.id];
    }
}

class Chunk {
    constructor(public tileArray: TileInformation[][]) {}

    public update(dt: number): void {
    }

    public render(ctx: CanvasRenderingContext2D,
                         leftBound: number,
                         rightBound: number,
                         offset: number): void {
        for (let row = 0; row < this.tileArray.length; row++) {
            for (let col = leftBound; col < rightBound; col++) {
                let tileInfo = this.tileArray[row][col];
                CanvasUtilities.fillStrokeRect(
                    ctx,
                    tileInfo.getFillStyle(),
                    tileInfo.getStrokeStyle(),
                    col * ChunkManager.tileSize + offset,
                    row * ChunkManager.tileSize,
                    ChunkManager.tileSize,
                    ChunkManager.tileSize,
                    1
                );
            }
        }
    }
}

namespace ChunkManager {
    export const CHUNK_WIDTH = 20;
    export const CHUNK_HEIGHT = 14;

    export let tileSize = 32;

    export let chunkLoaders: (() => Chunk)[];

    export function init() {
        ChunkManager.chunkLoaders = [];
        ChunkManager.chunkLoaders.push(() => new Chunk(
            TileInformation.loadFromIdArray(idArray1)
        ));
        ChunkManager.chunkLoaders.push(() => new Chunk(
            TileInformation.loadFromIdArray(idArray2)
        ));
        ChunkManager.chunkLoaders.push(() => new Chunk(
            TileInformation.loadFromIdArray(idArray3)
        ));
    }

    export function generateRandomChunk(): Chunk {
        return MathUtilities.randSelection(ChunkManager.chunkLoaders)();
    }
}
