namespace SaveState {
    const VERSION = "1";

    export function setHighScore(score: number): void {
        window.localStorage.setItem("highScore" + VERSION, "" + score);
    }

    export function getHighScore(): number {
        return window.localStorage.getItem("highScore" + VERSION);
    }

    export function setMute(mute: boolean): void {
        window.localStorage.setItem("mute", mute ? "1" : "0");
    }

    export function getMute(): boolean {
        return window.localStorage.getItem("mute") == "1";
    }
}
