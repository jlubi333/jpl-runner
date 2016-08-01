namespace SoundManager {
    export let background: HTMLAudioElement;
    export let jump: HTMLAudioElement;
    export let death: HTMLAudioElement;

    let muteButton: HTMLElement;
    let muted: boolean = false;
    let volumeBackups: {[id: string]: number} = {};

    const ASSET_TYPE = "sounds";

    function loadAudio(response: any, name: string): HTMLAudioElement {
        let audioData = response[name];
        const audio = new Audio(audioData["path"]);
        audio.loop = audioData["loop"];
        audio.volume = audioData["volume"];
        volumeBackups[name] = audio.volume;
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

        muteButton = document.getElementById("mute-button");

        muteButton.onclick = (event) => {
            toggleMute();
        }
    }

    export function toggleMute(): void {
        if (muted) {
            unmute();
            muteButton.innerHTML = "Mute";
        } else {
            mute();
            muteButton.innerHTML = "Unmute";
        }
    }

    /*
     * Note: *MUST* be called from within user click function stack
     */
    export function mobileInit(): void {
        background.play();
        background.pause();
        jump.play();
        jump.pause();
        death.play();
        death.pause();
    }

    function mute(): void {
        background.volume = 0;
        jump.volume = 0;
        death.volume = 0;
        muted = true;
    }

    function unmute(): void {
        background.volume = volumeBackups["background"];
        jump.volume = volumeBackups["jump"];
        death.volume = volumeBackups["death"];
        muted = false;
    }
}
