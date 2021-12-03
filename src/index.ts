import "zone.js";

Zone[Zone.__symbol__('ignoreConsoleErrorUncaughtError')] = true;

import "@vladmandic/face-api";
import {handleIguaPromiseRejection} from "./utils/rejection";
import {loadTextures} from "./textures";
import {loadLabels} from "./labels/loadLabels";
import {loadMusic, startMusic} from "./music";
import {loadMediaTexture} from "./mediaTexture";
import {showSection} from "./showSection";
import {handlePromiseCancellation} from "./utils/pissant/cancellationToken";
import {loadFaceDetectionModel} from "./loadFaceDetectionModel";
import {log} from "./log";

// (PIXI.settings as any).ROUND_PIXELS = true;
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

log("build number", process.env.GITHUB_RUN_NUMBER);

window.onload = initialize;

window.addEventListener("unhandledrejection", handleIguaPromiseRejection);
window.addEventListener("unhandledrejection", handlePromiseCancellation);

function pushStartButton()
{
    return new Promise<void>(resolve =>
        document.getElementById('start_button')!.onclick = () => {
            resolve();
            startMusic();
        })
}

async function initialize() {
    try {
        showSection('loading');
        require("./utils/extensions/**/*.*");
        log(1, "load labels");
        await loadLabels();
        log(2, "load textures");
        await loadTextures();
        log(3, "load music");
        await loadMusic();
        log(4, "load media texture");
        await loadMediaTexture();
        log(5, "load face detection model");
        await loadFaceDetectionModel();
        showSection('start');
        log(6, "wait for push start");
        await pushStartButton();
        showSection('game');
        log(7, "start game");
        await require("./igua/game").startGame();
    }
    catch (e) {
        showSection('fatal_error');
        document.getElementById('fatal_error_message')!.textContent = `${e}`;
        throw e;
    }
}
