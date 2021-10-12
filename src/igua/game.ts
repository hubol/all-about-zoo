import {Container} from "pixi.js";
import {BaseTexture, MIPMAP_MODES, Sprite, Texture, VideoResource} from "pixi.js-legacy";
import {AsshatTicker} from "../utils/asshatTicker";
import {advanceKeyListener, startKeyListener} from "../utils/browser/key";
import {AsshatApplication, createApplication} from "../utils/pixi/createApplication";
import {upscaleGameCanvas} from "./upscaleGameCanvas";
import {environment} from "./environment";
import {make2dCanvasSink} from "../utils/browser/make2dCanvasSink";
import {textures} from "../textures";
import {packing} from "../scenes/packing";
import {music} from "../music";
import {showLyrics} from "../showLyrics";

export let scene: Container;
export let canvas: HTMLCanvasElement;
export let mediaTexture: Texture;

export async function createGame()
{
    mediaTexture = await makeMediaTexture();
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
    packing();
}

export function makeFullMediaSprite() {
    const mediaSprite = Sprite.from(mediaTexture);
    mediaSprite.anchor.x = 1;
    mediaSprite.scale.x *= -1;
    return scene.addChild(mediaSprite);
}

async function makeMediaTexture() {
    try
    {
        const element = await makeUserMediaVideoElement();
        const res = new VideoResource(element);
        const baseTexture = new BaseTexture(res, {mipmap: MIPMAP_MODES.OFF});
        return new Texture(baseTexture);
    }
    catch (e) {
        console.error(e);
        return textures.Dummy;
    }
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
