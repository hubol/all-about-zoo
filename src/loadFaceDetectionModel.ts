import {detectSingleFace, env, nets, tf, TinyFaceDetectorOptions} from "@vladmandic/face-api";
import './face/tiny_face_detector_model-weights_manifest.json';
// console.log("wtf2");
import './face/tiny_face_detector_model-shard1.bin';
import {videoElement} from "./mediaTexture";

export async function loadFaceDetectionModel() {
    // await tf.setBackend('cpu');
    // console.log(videoElement instanceof env.getEnv().Canvas, videoElement)
    // console.log("wtf");
    // const manifestJson = require('./face/tiny_face_detector_model-weights_manifest.json');
    // console.log("wtf2");
    // const weightUri = require('./face/tiny_face_detector_model-shard1.bin');
    // console.log("wtf3");

    await tf.setBackend('webgl');

    await tf.enableProdMode();
    await tf.ENV.set('DEBUG', false);
    await tf.ready();

    // console.log(tf);
    // console.log(tf.loadWeightsAsArrayBuffer);
    // console.log(tf.weightsLoaderFactory);
    //
    // const fetchWeights = () =>
    //     tf.loadWeightsAsArrayBuffer([weightUri], {fetchFunc: fetch});
    // const loadWeights = tf.weightsLoaderFactory(fetchWeights);
    //
    // const weights = await loadWeights(manifestJson);
    await nets.tinyFaceDetector.load('./')
}
