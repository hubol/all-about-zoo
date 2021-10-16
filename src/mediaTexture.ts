import {BaseTexture, MIPMAP_MODES, Texture, VideoResource} from "pixi.js-legacy";
import {textures} from "./textures";

export let mediaTexture: Texture;
export let faceTexture: Texture;
export let videoElement: HTMLVideoElement;

export async function loadMediaTexture() {
    mediaTexture = await makeMediaTexture();
    faceTexture = new Texture(mediaTexture.baseTexture);
}

async function makeMediaTexture() {
    try
    {
        videoElement = await makeUserMediaVideoElement();
        const res = new VideoResource(videoElement);
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
