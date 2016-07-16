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
        Mouse.init();
        Keyboard.init();
        ChunkManager.init(doneCallback);
        SoundManager.init(doneCallback);
    }

    export function getAssetFile(assetType: string) {
        return "../assets/" + assetType + ".json";
    }
}
