import {music} from "../music";
import {wait} from "../cutscene/wait";
import {executeLabels} from "./executeLabels";
import {lyrics} from "./loadLabels";

export let lyric: string = '';

export async function showLyrics() {
    await executeLabels(lyrics, async ({ end, text }) => {
        const element = document.getElementById('lyrics')!;
        element.className = text.endsWith('!') ? 'shake' : '';
        lyric = text;
        element.textContent = text;
        await wait(() => music.currentTime >= end);
        lyric = '';
        element.textContent = null;
    })
}
