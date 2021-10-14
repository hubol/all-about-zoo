import {createCanvasFromMedia, imageToSquare, TinyYolov2SizeType} from "face-api.js";
import {faceDetectionWorker} from "./faceDetectionWorkerInterface";
import {mediaTexture, videoElement} from "./mediaTexture";
import {fromPixels} from "./fuk";
import {sleep} from "pissant";

export let face = { x: 0, y: 0, width: 128, height: 128 };
export let flippedFace = { x: 0, y: 0, width: 128, height: 128 };

function makeCunt() {
    return [...fromPixels(imageToSquare(createCanvasFromMedia(videoElement), TinyYolov2SizeType.XS, true)), mediaTexture.width, mediaTexture.height];
}

export async function publishFaceDetectionForever() {
    while (true) {
        await publishFaceDetection();
        // await sleep(33);
    }
}

async function publishFaceDetection() {
    if (!videoElement)
        return;
    const faces = await faceDetectionWorker.detectFace(makeCunt());
    console.log('got', faces);
    if (!faces)
        return;
    face = faces.face;
    flippedFace = faces.flippedFace;
    console.log(face, flippedFace);
}
