import * as whatever from "@tensorflow/tfjs-backend-cpu";
import {
    detectSingleFace,
    NetInput,
    nets,
    tf,
    TinyFaceDetectorOptions,
    TinyYolov2SizeType
} from "face-api.js";
import {loadWeightsAsArrayBuffer, weightsLoaderFactory} from "@tensorflow/tfjs-core/dist/io/weights_loader";
import {setBackend, Tensor, tensor3d, Tensor3D, Tensor4D} from "@tensorflow/tfjs-core";

export async function loadModel() {
    await setBackend('cpu');
    const manifestJson = require('./face/tiny_face_detector_model-weights_manifest.json');
    const weightUri = require('./face/tiny_face_detector_model-shard1.bin');

    const fetchWeights = () =>
        loadWeightsAsArrayBuffer([weightUri], { fetchFunc: fetch });
    const loadWeights = weightsLoaderFactory(fetchWeights);

    const weights = await loadWeights(manifestJson);
    nets.tinyFaceDetector.loadFromWeightMap(weights as any);

    console.log("BITCH1!")
}

export async function detectFace(args: any[]) {
    const [t1, t2, t3, inputWidth, inputHeight] = args;
    console.log("BITCH2!", args);
    const options = new TinyFaceDetectorOptions({ inputSize: TinyYolov2SizeType.XS });
    const cuntInput = new CuntInput(tensor3d(t1, t2, t3), inputWidth, inputHeight) as any;
    console.log(cuntInput, cuntInput instanceof NetInput, cuntInput.prototype);
    const singleFace = await detectSingleFace(cuntInput, options);
    console.log('a')
    if (!singleFace)
        return;
    console.log('b')
    const { x, y, width, height } = singleFace.box;
    return {
        flippedFace: { x, y, width, height },
        face: { x: inputWidth - x - width, y, width, height }
    };
}

export class CuntInput extends NetInput {
    // @ts-ignore
    constructor(tensor: Tensor3D, width, height) {
        // super();
        // @ts-ignore
        this.data = tensor;
        this._batchSize = 1;
        this._inputDimensions = [[height, width]];
    }

    // @ts-ignore
    toBatchTensor(inputSize: number, isCenterInputs?: boolean): Tensor4D {
        this._inputSize = inputSize;
        console.log(this.getInputDimensions(0));
        console.log('1');
        // @ts-ignore
        return tf.tidy(() => {
            console.log('2');
            console.log(this.data, this.data instanceof Tensor);
            /// @ts-ignore
            console.log('3');
            const batchTensor = tf.stack([this.data]).as4D(1, inputSize, inputSize, 3)
            console.log('4');
            return batchTensor
        })
    }
}
