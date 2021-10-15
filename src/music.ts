import {wait} from "./cutscene/wait";

export let music: HTMLAudioElement;

export async function loadMusic() {
    const audio = new Audio(require('./music.mp3'));
    audio.load();
    await new Promise<void>(resolve => audio.addEventListener('canplaythrough', () => resolve()));
    music = audio;
}

export async function startMusic() {
    await wait(() => !!music);
    await music.play();
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible')
            await music.play();
        else
            await music.pause();
    })
}
