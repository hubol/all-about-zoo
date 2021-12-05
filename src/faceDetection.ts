import {detectSingleFace, FaceDetection, Rect, TinyFaceDetectorOptions} from "@vladmandic/face-api";
import {faceTexture, videoElement} from "./mediaTexture";
import {Rectangle} from "pixi.js-legacy";

export let face = new FaceDetection(1, new Rect(0, 0, 128, 128), {width: 128, height: 128});
export let flippedFace = new FaceDetection(1, new Rect(0, 0, 128, 128), {width: 128, height: 128});

async function detectFace() {
    if (!videoElement)
        return; // TODO
    const options = new TinyFaceDetectorOptions({inputSize: 192});
    const singleFace = await detectSingleFace(videoElement, options);
    if (!singleFace)
        return;
    flippedFace = singleFace;
    face = new FaceDetection(
        singleFace.score,
        new Rect(1 - singleFace.relativeBox.x - singleFace.relativeBox.width, singleFace.relativeBox.y, singleFace.relativeBox.width, singleFace.relativeBox.height),
        singleFace.imageDims);
    faceTexture.frame = new Rectangle(
        Math.max(0, Math.min(singleFace.box.x, faceTexture.baseTexture.width - 2)),
        Math.max(0, Math.min(singleFace.box.y, faceTexture.baseTexture.height - 2)),
        Math.max(1, Math.min(singleFace.box.width, faceTexture.baseTexture.width - singleFace.box.x - 1)),
        Math.max(1, Math.min(singleFace.box.height, faceTexture.baseTexture.height - singleFace.box.y - 1)));
    faceTexture.updateUvs();
}

function sleep(ms) {
    return new Promise<void>(r => setTimeout(r, ms));
}

export async function detectFaceForever() {
    while (true) {
        await detectFace();
        await sleep(82);
    }
}
