namespace SaveState {
    export function setHighScore(score: number): void {
        window.localStorage.setItem("highScore", "" + score);
    }
    export function getHighScore(): number {
        return window.localStorage.getItem("highScore");
    }
}
