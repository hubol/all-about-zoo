import {labels} from "./loadLabels";
import {wait} from "pissant";
import {music} from "./music";

export let lyric: string = '';

export async function showLyrics() {
    const lyrics = [...labels];
    const element = document.getElementById('lyrics')!;
    while (lyrics.length > 0) {
        const [start, end, text] = lyrics.shift()!;
        await wait(() => music.currentTime >= start);
        lyric = text;
        element.textContent = text;
        await wait(() => music.currentTime >= end);
        lyric = '';
        element.textContent = null;
    }
}
