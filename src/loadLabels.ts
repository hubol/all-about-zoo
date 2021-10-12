const labelPath = require('./label.txt');

type Label = [start: number, end: number, text: string];
export let labels: Label[];

export async function loadLabels() {
    const labelText = await fetch(labelPath).then(x => x.text());
    labels = labelText
        .split(/\r\n|\n/)
        .map(x => x.split(/\t/).filter(x => x))
        .filter(x => x.length === 3)
        .map(([a, b, text]) => [Number(a), Number(b), text]);
}
