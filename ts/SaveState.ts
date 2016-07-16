namespace SaveState {
    const VERSION = "1";

    export function setHighScore(score: number): void {
        window.localStorage.setItem("highScore" + VERSION, "" + score);
    }
    export function getHighScore(): number {
        return window.localStorage.getItem("highScore" + VERSION);
    }
}
