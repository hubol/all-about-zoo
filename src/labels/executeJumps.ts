import {application} from "../igua/game";
import {executeLabels} from "./executeLabels";
import {jumps} from "./loadLabels";
import {gotoScene} from "../igua/gotoScene";
import {dev} from "../dev";

export async function executeJumps() {
    if (dev.doNotAutoGotoScene)
        return;
    await executeLabels(jumps, ({text}) => gotoScene(text));
}
