import * as Comlink from "comlink";
import {detectFace, loadModel} from "./faceDetection";

Comlink.expose({ loadModel, detectFace });
