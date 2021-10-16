import {loadWeightsAsArrayBuffer, weightsLoaderFactory} from "@tensorflow/tfjs-core/dist/io/weights_loader";
import {detectSingleFace, nets, TinyFaceDetectorOptions} from "face-api.js";
import {videoElement} from "./mediaTexture";

export async function loadFaceDetectionModel() {
    const manifestJson = require('./face/tiny_face_detector_model-weights_manifest.json');
    const weightUri = require('./face/tiny_face_detector_model-shard1.bin');

    const fetchWeights = () =>
        loadWeightsAsArrayBuffer([weightUri], {fetchFunc: fetch});
    const loadWeights = weightsLoaderFactory(fetchWeights);

    const weights = await loadWeights(manifestJson);
    nets.tinyFaceDetector.loadFromWeightMap(weights as any);

    try {
        await detectSingleFace(videoElement, new TinyFaceDetectorOptions());
    } catch (e) {

    }
}
