const labelPath = require('./label.txt');

export type Label = [start: number, end: number, text: string];
export let labels: Label[];
export const lyrics: Label[] = [];
export const jumps: Label[] = [];
export const messages: Label[] = [];

export async function loadLabels() {
    const labelText = await fetch(labelPath).then(x => x.text());
    labels = labelText
        .split(/\r\n|\n/)
        .map(x => x.split(/\t/).filter(x => x))
        .filter(x => x.length === 3)
        .map(([a, b, text]) => [Number(a), Number(b), text]);
    labels.forEach(([start, end, message]) => {
        let dest = lyrics;
        if (message.startsWith('!'))
            dest = messages;
        else if (message.startsWith('>'))
            dest = jumps;
        message = dest === lyrics ? message : message.substring(1);
        dest.push([start, end, message]);
    });
}
