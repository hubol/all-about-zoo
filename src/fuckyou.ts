import {detectSingleFace, fetchJson, nets, TinyFaceDetectorOptions} from "face-api.js";
// import * as faceapi from "face-api.js";
import {videoElement} from "./mediaTexture";
import {env} from "@tensorflow/tfjs-core";
import {loadWeightsAsArrayBuffer, weightsLoaderFactory} from "@tensorflow/tfjs-core/dist/io/weights_loader";

export async function stupid() {
    const manifestUri = require('./face/tiny_face_detector_model-weights_manifest.json');
    const weightUri = require('./face/tiny_face_detector_model-shard1.bin');
    console.log(weightUri);
    //
    const manifest = manifestUri;
    const fu = weightUri.lastIndexOf('/');
    const [directory, shard] = fu < 1 ? ['/', weightUri.replace('/', '')] : split(weightUri, fu);
    console.log(directory, shard);
    // env().registerFlag('DEBUG', () => false);
    // env().registerFlag('IS_NODE', () => false);
    // env().set('DEBUG', false);
    const fetchWeights = () =>
        loadWeightsAsArrayBuffer([weightUri], { fetchFunc: fetch });
    const loadWeights = weightsLoaderFactory(fetchWeights);

    const a = await loadWeights(manifest);
    nets.tinyFaceDetector.loadFromWeightMap(a as any);
    //
    console.log(a);
}

function split(value: string, index: number) {
    return [value.substring(0, index) ,value.substring(index)];
}

export async function wtf() {
    if (!videoElement)
        return; // TODO
    const options = new TinyFaceDetectorOptions();
    const face = await detectSingleFace(videoElement, options);
    if (!face)
        return;
    console.log(face.box.x);
}
