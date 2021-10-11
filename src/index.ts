import * as PIXI from "pixi.js";
import {handleIguaPromiseRejection} from "./utils/rejection";
import {handlePromiseCancellation} from "pissant";
import {environment} from "./igua/environment";

(PIXI.settings as any).ROUND_PIXELS = true;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

async function initialize()
{
    // @ts-ignore
    require("./utils/extensions/**/*.*");
    // @ts-ignore
    setTimeout(require("./igua/game").createGame);
}

if (environment.isProduction && !environment.isElectron)
    document.body.appendChild(createStartGameButtonElement());
else
    window.onload = initialize;

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
