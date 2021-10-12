import {Container} from "pixi.js";
import {BaseTexture, MIPMAP_MODES, Sprite, Texture, VideoResource } from "pixi.js-legacy";
import {AsshatTicker} from "../utils/asshatTicker";
import {advanceKeyListener, startKeyListener} from "../utils/browser/key";
import {createApplication} from "../utils/pixi/createApplication";
import {upscaleGameCanvas} from "./upscaleGameCanvas";
import {environment} from "./environment";
import {make2dCanvasSink} from "../utils/browser/make2dCanvasSink";
import {RGBSplitFilter} from "pixi-filters";
import {textures} from "../textures";

export let scene: Container;

export async function createGame()
{
    const mediaSprite = await makeMediaSprite();
    const application = createApplication({width: mediaSprite.width, height: mediaSprite.height, targetFps: 60, showCursor: false});
    upscaleGameCanvas(addGameCanvasToDocument(application.canvasElement));

    application.ticker.start();
    application.stage.withTicker(new AsshatTicker());
    scene = application.stage;

    startKeyListener();

    application.ticker.add(() => {
        advanceKeyListener();
        scene.ticker.update();
    });

    mediaSprite.anchor.x = 1;
    mediaSprite.scale.x *= -1;
    mediaSprite.filters = [new RGBSplitFilter([-3, 0], [0, 3], [0, 0])];
    scene.addChild(mediaSprite);
    const holeSprite = Sprite.from(textures.LunchFaceHole);
    holeSprite.scale.set(0.6, 0.6);
    scene.addChild(holeSprite);
}

async function makeMediaSprite() {
    const element = await makeUserMediaVideoElement();
    const res = new VideoResource(element);
    const baseTexture = new BaseTexture(res, { mipmap: MIPMAP_MODES.OFF });
    const mediaTexture = new Texture(baseTexture);
    return new Sprite(mediaTexture);
}

async function makeUserMediaVideoElement() {
    const media = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user' } });
    const videoElement = document.createElement('video');
    videoElement.srcObject = media;
    // https://stackoverflow.com/a/54678952
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('muted', '');
    videoElement.setAttribute('playsinline', '');
    await videoElement.play();
    return videoElement;
}

function addGameCanvasToDocument(element: HTMLCanvasElement)
{
    if (environment.isSafari)
        element = make2dCanvasSink(element);

    element.id = "gameCanvas";
    document.body.appendChild(element);

    return element;
}
