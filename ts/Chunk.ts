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
                CanvasUtilities.scaledRect(
                    ctx,
                    tileInfo.getFillStyle(),
                    tileInfo.getStrokeStyle(),
                    col + offset,
                    row ,
                    1,
                    1,
                    1 / Scale.scale
                );
            }
        }
    }
}

namespace ChunkManager {
    export let chunkWidth: number;
    export let chunkHeight: number;
    export let tileSize: number;

    export let chunkLoaders: (() => Chunk)[];

    const ASSET_TYPE = "chunks";

    export function init(callback: () => void): void {
        const chunkRequest = new XMLHttpRequest();

        chunkRequest.onload = function() {
            const response = JSON.parse(this.responseText);

            chunkWidth = response["chunkWidth"];
            chunkHeight = response["chunkHeight"];
            const idArrays = response["chunks"];

            chunkLoaders = [];
            for (let i = 0; i < idArrays.length; i++) {
                let idArray = idArrays[i];
                if (idArray.length != chunkHeight) {
                    console.error("Chunk #" + i +
                                  " height does not match chunkHeight.");
                }
                if (idArray[0].length != chunkWidth) {
                    console.error("Chunk #" + i +
                                  " width does not match chunkWidth.");
                }
                ChunkManager.chunkLoaders.push(() => new Chunk(
                    TileInformation.loadFromIdArray(idArray)
                ));
            }

            callback();
        };
        chunkRequest.open("GET", GameManager.getAssetFile(ASSET_TYPE), true);
        chunkRequest.send();
    }

    export function generateRandomChunk(): Chunk {
        return MathUtilities.randSelection(ChunkManager.chunkLoaders)();
    }
}
