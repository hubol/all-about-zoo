import {Container} from "pixi.js";
import {Sprite} from "pixi.js-legacy";
import {AsshatTicker} from "../utils/asshatTicker";
import {advanceKeyListener, startKeyListener} from "../utils/browser/key";
import {createApplication} from "../utils/pixi/createApplication";
import {upscaleGameCanvas} from "./upscaleGameCanvas";
import {environment} from "./environment";
import {make2dCanvasSink} from "../utils/browser/make2dCanvasSink";
import {packing} from "../scenes/packing";
import {music} from "../music";
import {showLyrics} from "../showLyrics";
import {mediaTexture} from "../mediaTexture";
import {publishFaceDetectionForever} from "../face";

export let scene: Container;
export let canvas: HTMLCanvasElement;

export async function startGame()
{
    const application = createApplication({width: mediaTexture.width, height: mediaTexture.height, targetFps: 60, showCursor: false});
    upscaleGameCanvas(addGameCanvasToDocument(application.canvasElement));

    application.ticker.start();
    application.stage.withTicker(new AsshatTicker());
    scene = application.stage;
    canvas = application.canvasElement;

    startKeyListener();

    application.ticker.add(() => {
        advanceKeyListener();
        scene.ticker.update();
    });

    await music.play();
    setTimeout(showLyrics);
    setTimeout(publishFaceDetectionForever, 67);
    packing();
}

export function makeFullMediaSprite() {
    const mediaSprite = Sprite.from(mediaTexture);
    mediaSprite.anchor.x = 1;
    mediaSprite.scale.x *= -1;
    return scene.addChild(mediaSprite);
}

function addGameCanvasToDocument(element: HTMLCanvasElement)
{
    if (environment.isSafari)
        element = make2dCanvasSink(element);

    element.id = "game_canvas";
    document.getElementById('game')!.appendChild(element);

    return element;
}
