import {detectSingleFace, FaceDetection, nets, Rect, TinyFaceDetectorOptions, TinyYolov2SizeType} from "face-api.js";
import {videoElement} from "./mediaTexture";
import {loadWeightsAsArrayBuffer, weightsLoaderFactory} from "@tensorflow/tfjs-core/dist/io/weights_loader";

export async function loadModel() {
    const manifestJson = require('./face/tiny_face_detector_model-weights_manifest.json');
    const weightUri = require('./face/tiny_face_detector_model-shard1.bin');

    const fetchWeights = () =>
        loadWeightsAsArrayBuffer([weightUri], { fetchFunc: fetch });
    const loadWeights = weightsLoaderFactory(fetchWeights);

    const weights = await loadWeights(manifestJson);
    nets.tinyFaceDetector.loadFromWeightMap(weights as any);

    try {
        await detectSingleFace(videoElement, new TinyFaceDetectorOptions());
    }
    catch (e) {

    }
}

export let face = new FaceDetection(1, new Rect(0, 0, 128, 128), { width: 128, height: 128 });
export let flippedFace = new FaceDetection(1, new Rect(0, 0, 128, 128), { width: 128, height: 128 });

export async function detectFace() {
    if (!videoElement)
        return; // TODO
    const options = new TinyFaceDetectorOptions({ inputSize: TinyYolov2SizeType.XS });
    const singleFace = await detectSingleFace(videoElement, options);
    if (!singleFace)
        return;
    flippedFace = singleFace;
    face = new FaceDetection(
        singleFace.score,
        new Rect(1 - singleFace.relativeBox.x - singleFace.relativeBox.width, singleFace.relativeBox.y, singleFace.relativeBox.width, singleFace.relativeBox.height),
        singleFace.imageDims);
}
