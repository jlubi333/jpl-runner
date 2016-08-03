namespace SoundManager {
    export let background: HTMLAudioElement;
    export let jump: HTMLAudioElement;
    export let death: HTMLAudioElement;

    let muteButton: HTMLElement;
    let muted: boolean;
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

            muteButton = document.getElementById("mute-button");

            muteButton.onclick = (event) => {
                toggleMute();
            }

            if (SaveState.getMute()) {
                muteButton.click();
            }

            callback();
        };
        soundRequest.open("GET", GameManager.getAssetFile(ASSET_TYPE), true);
        soundRequest.send();

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
        stopSound(background)
        jump.play();
        stopSound(jump)
        death.play();
        stopSound(death)

    }

    export function blur(): void {
        background.pause();
        stopSound(death)
        stopSound(jump)
    }

    export function focus(): void {
        background.play();
    }

    export function stopSound(sound: HTMLAudioElement): void {
        sound.pause();
        sound.currentTime = 0;
    }

    function mute(): void {
        background.volume = 0;
        jump.volume = 0;
        death.volume = 0;
        muted = true;
        SaveState.setMute(true);
    }

    function unmute(): void {
        background.volume = volumeBackups["background"];
        jump.volume = volumeBackups["jump"];
        death.volume = volumeBackups["death"];
        muted = false;
        SaveState.setMute(false);
    }
}
