import * as PIXI from "pixi.js";
import {handleIguaPromiseRejection} from "./utils/rejection";
import {handlePromiseCancellation} from "pissant";
import {loadTextures} from "./textures";
import {loadLabels} from "./loadLabels";
import {loadMusic} from "./music";
import {loadMediaTexture} from "./mediaTexture";

(PIXI.settings as any).ROUND_PIXELS = true;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

window.onload = initialize;

window.addEventListener("unhandledrejection", handleIguaPromiseRejection);
window.addEventListener("unhandledrejection", handlePromiseCancellation);

function pushStartButton()
{
    return new Promise<void>(resolve => {
        const buttonElement = document.createElement("button");
        buttonElement.id = "startButton";
        buttonElement.textContent = "Start game";
        buttonElement.onclick = () => {
            document.body.removeChild(buttonElement);
            resolve();
        };
        document.body.appendChild(buttonElement);
    })
}

async function initialize() {
    require("./utils/extensions/**/*.*");
    await loadLabels();
    await loadTextures();
    await loadMusic();
    await loadMediaTexture();
    await pushStartButton();
    await require("./igua/game").startGame();
}
