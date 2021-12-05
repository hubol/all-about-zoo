import {dev} from "./dev";
import {fastForwardToScene} from "./labels/fastForwardToScene";
import {log} from "./log";

export let music: HTMLAudioElement;

export async function loadMusic() {
    const audio = new Audio(require('./music.mp3'));
    audio.load();
    await new Promise<void>(resolve => audio.addEventListener('canplaythrough', () => resolve()));
    music = audio;
}

export async function startMusic() {
    log("start music...");
    await music.play();
    log("...done starting music!");
    if (dev.fastForwardToScene)
        fastForwardToScene(dev.fastForwardToScene);
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            log("resume music...");
            await music.play();
            log("...done resuming music");
        }
        else {
            log("pause music...");
            await music.pause();
            log("...done pausing music");
        }
    })
}
