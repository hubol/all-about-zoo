import {mergeFunctionLeaves} from "../utils/mergeFunctionLeaves";
import {createNewScene} from "./game";

const sceneModules = require("../scenes/**/*.*");
console.debug("Got scene modules", sceneModules);
const scenes = mergeFunctionLeaves(sceneModules);

export function gotoScene(name: string) {
    createNewScene();
    scenes[name]();
}
