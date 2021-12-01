export function log(...message) {
    console.log(`${(performance.now()/1000).toFixed(2)}s`, ...message);
}
