export let music: HTMLAudioElement;

export async function loadMusic() {
    const audio = new Audio(require('./music.mp3'));
    audio.load();
    await new Promise<void>(resolve => audio.addEventListener('canplaythrough', () => resolve()));
    music = audio;
}
