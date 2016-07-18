namespace ScoreUtilities {
    let scoreOutputs: NodeListOf<Element>;
    let highScoreOutputs: NodeListOf<Element>;

    export function init() {
        scoreOutputs = document.getElementsByClassName("score");
        highScoreOutputs = document.getElementsByClassName("high-score");
    }

    export function displayScore(score: number): void {
        let scoreString = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Score: " +
                          Math.round(score);
        for (let i = 0; i < scoreOutputs.length; i++) {
            scoreOutputs[i].innerHTML = scoreString;
        }
    }

    export function displayHighScore(): void {
        let highScoreString = "High Score: " + Math.round(SaveState.getHighScore());
        for (let i = 0; i < highScoreOutputs.length; i++) {
            highScoreOutputs[i].innerHTML = highScoreString;
        }
    }
}
