import {executeLabels} from "./executeLabels";
import {wait} from "../cutscene/wait";
import {messageLabels} from "./loadLabels";

const messages = {};

export async function broadcastMessages() {
    await executeLabels(messageLabels, ({text}) => messages[text] = 1);
}

export async function message(text: string) {
    await wait(() => text in messages);
}
