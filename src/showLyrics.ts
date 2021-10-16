import {labels} from "./loadLabels";
import {music} from "./music";
import {wait} from "./cutscene/wait";
import {gotoScene} from "./igua/gotoScene";

export let lyric: string = '';

export async function showLyrics() {
    const lyrics = [...labels];
    while (lyrics.length > 0) {
        const [start, end, text] = lyrics.shift()!;
        await wait(() => music.currentTime >= start);
        await executeLabel(start, end, text);
    }
}

export const dev = {
    doNotAutoGotoScene: false
};

async function executeLabel(start, end, text: string) {
    if (text.startsWith('>')) {
        if (!dev.doNotAutoGotoScene)
            gotoScene(text.substring(1).trim());
        return;
    }

    const element = document.getElementById('lyrics')!;
    lyric = text;
    element.textContent = text;
    await wait(() => music.currentTime >= end);
    lyric = '';
    element.textContent = null;
}
