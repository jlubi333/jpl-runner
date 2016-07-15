namespace GameManager {
    const TASK_COUNT = 1;
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
    }
}
