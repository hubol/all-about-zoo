const labelPath = require('./label.txt');

export type Label = [start: number, end: number, text: string];

export async function loadLabels() {
    const labelText = await fetch(labelPath).then(x => x.text());
    const labels = labelText
        .split(/\r\n|\n/)
        .map(x => x.split(/\t/).filter(x => x))
        .filter(x => x.length === 3)
        .map(([a, b, text]) => [Number(a), Number(b), text]) as Label[];
    console.log(labels);
}
