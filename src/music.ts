import {dev} from "./dev";
import {fastForwardToScene} from "./labels/fastForwardToScene";

export let music: HTMLAudioElement;

export async function loadMusic() {
    const audio = new Audio(require('./music.mp3'));
    audio.load();
    await new Promise<void>(resolve => audio.addEventListener('canplaythrough', () => resolve()));
    music = audio;
    // @ts-ignore
    window.music = music;
}

export async function startMusic() {
    await music.play();
    if (dev.fastForwardToScene)
        fastForwardToScene(dev.fastForwardToScene);
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible')
            await music.play();
        else
            await music.pause();
    })
}
