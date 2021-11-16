import {music} from "../music";
import {jumps} from "./loadLabels";

export function fastForwardToScene(scene: string) {
    const [time] = jumps.find(([_, __, name]) => scene === name) ?? [0];
    music.currentTime = time;
}
