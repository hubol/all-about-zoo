import {Label} from "./loadLabels";
import {wait} from "../cutscene/wait";
import {music} from "../music";

export async function executeLabels(labels: Label[], fn: ({start, end, text}) => unknown) {
    const lyrics = [...labels];
    while (lyrics.length > 0) {
        const [start, end, text] = lyrics.shift()!;
        await wait(() => music.currentTime >= start);
        const result = fn({start, end, text});
        if (result)
            await result;
    }
}
