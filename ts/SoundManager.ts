namespace SoundManager {
    export let background: HTMLAudioElement;
    export let jump: HTMLAudioElement;
    export let death: HTMLAudioElement;

    const ASSET_TYPE = "sounds";

    function loadAudio(response: any, name: string): HTMLAudioElement {
        let audioData = response[name];
        const audio = new Audio(audioData["path"]);
        audio.loop = audioData["loop"];
        audio.volume = audioData["volume"];
        return audio;
    }

    export function init(callback: () => void): void {
        const soundRequest = new XMLHttpRequest();
        soundRequest.onload = function() {
            const response = JSON.parse(this.responseText);

            background = loadAudio(response, "background");
            jump = loadAudio(response, "jump");
            death = loadAudio(response, "death");

            callback();
        };
        soundRequest.open("GET", GameManager.getAssetFile(ASSET_TYPE), true);
        soundRequest.send();
    }
}
