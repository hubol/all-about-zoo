import * as Comlink from "comlink";

export const faceDetectionWorker = Comlink.wrap<any>(new Worker("faceDetectionWorker.ts"));
