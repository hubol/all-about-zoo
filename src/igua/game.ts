import {Container} from "pixi.js";
import {Sprite} from "pixi.js-legacy";
import {AsshatTicker} from "../utils/asshatTicker";
import {advanceKeyListener, startKeyListener} from "../utils/browser/key";
import {AsshatApplication, createApplication} from "../utils/pixi/createApplication";
import {upscaleGameCanvas} from "./upscaleGameCanvas";
import {environment} from "./environment";
import {make2dCanvasSink} from "../utils/browser/make2dCanvasSink";
import {startMusic} from "../music";
import {showLyrics} from "../showLyrics";
import {mediaTexture} from "../mediaTexture";
import {detectFaceForever} from "../faceDetection";
import {elephants} from "../scenes/elephants";

export let application: AsshatApplication;
export let scene: Container;
export let canvas: HTMLCanvasElement;

function createNewScene() {
    if (scene && !scene.destroyed)
        scene.destroy({ children: true });
    scene = application.stage.addChild(new Container());
}

export async function startGame()
{
    application = createApplication({width: mediaTexture.width, height: mediaTexture.height, targetFps: 60, showCursor: false});
    upscaleGameCanvas(addGameCanvasToDocument(application.canvasElement));

    application.ticker.start();
    application.stage.withTicker(new AsshatTicker());
    createNewScene();
    canvas = application.canvasElement;

    startKeyListener();

    application.ticker.add(() => {
        advanceKeyListener();
        application.stage.ticker.update();
    });

    setTimeout(showLyrics);
    setTimeout(detectFaceForever)
    setTimeout(startMusic, 125);
    // packing();
    elephants();
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
