import * as PIXI from "pixi.js";
import {createApplication} from "./utils/pixi/createApplication";
import {upscaleGameCanvas} from "./igua/upscaleGameCanvas";
import {handleIguaPromiseRejection} from "./utils/rejection";
import {make2dCanvasSink} from "./utils/browser/make2dCanvasSink";
import {handlePromiseCancellation} from "pissant";
import {environment} from "./igua/environment";

(PIXI.settings as any).ROUND_PIXELS = true;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
const application = createApplication({width: 256, height: 256, targetFps: 60, showCursor: false});

async function initialize()
{
    upscaleGameCanvas(addGameCanvasToDocument(application.canvasElement));
    // @ts-ignore
    require("./utils/extensions/**/*.*");
    // @ts-ignore
    require("./igua/game");
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

function addGameCanvasToDocument(element: HTMLCanvasElement)
{
    if (environment.isSafari)
        element = make2dCanvasSink(element);

    element.id = "gameCanvas";
    document.body.appendChild(element);

    return element;
}
