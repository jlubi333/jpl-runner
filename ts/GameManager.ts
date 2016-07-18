namespace GameManager {
    const TASK_COUNT = 2;
    let tasksComplete = 0;

    function done(callback: () => void) {
        tasksComplete += 1;
        if (tasksComplete == TASK_COUNT) {
            callback()
        }
    }

    export function init(callback: () => void): void {
        let doneCallback = () => done(callback)
        ScoreUtilities.init();
        ChunkManager.init(doneCallback);
        SoundManager.init(doneCallback);
    }

    export function getAssetFile(assetType: string) {
        // The generated JavaScript file will be in the root directory, so this
        // is relative to that.
        return "assets/" + assetType + ".json";
    }
}
