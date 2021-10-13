import * as PIXI from "pixi.js";
import {handleIguaPromiseRejection} from "./utils/rejection";
import {handlePromiseCancellation} from "pissant";
import {environment} from "./igua/environment";
import {loadTextures} from "./textures";
import {loadLabels} from "./loadLabels";
import {loadMusic} from "./music";
import {loadMediaTexture} from "./mediaTexture";

(PIXI.settings as any).ROUND_PIXELS = true;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

async function initialize()
{
    try {
        await require("./igua/game").createGame();
    }
    catch (e) {
        document.body.append(e.toString());
    }
}

// if (environment.isProduction && !environment.isElectron)
//     document.body.appendChild(createStartGameButtonElement());
// else
    window.onload = realInitialize;

window.addEventListener("unhandledrejection", handleIguaPromiseRejection);
window.addEventListener("unhandledrejection", handlePromiseCancellation);

function createStartGameButtonElement()
{
    const buttonElement = document.createElement("button");
    buttonElement.id = "startButton";
    buttonElement.textContent = "Start game";
    buttonElement.onclick = () => {
        document.body.removeChild(buttonElement);
        setTimeout(initialize);
    };
    return buttonElement;
}

async function realInitialize() {
    require("./utils/extensions/**/*.*");
    await loadLabels();
    await loadTextures();
    await loadMusic();
    await loadMediaTexture();
    document.body.appendChild(createStartGameButtonElement());
}
