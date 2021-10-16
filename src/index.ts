import "zone.js";

Zone[Zone.__symbol__('ignoreConsoleErrorUncaughtError')] = true;

import * as whatever from "@tensorflow/tfjs-backend-cpu";
import {handleIguaPromiseRejection} from "./utils/rejection";
import {loadTextures} from "./textures";
import {loadLabels} from "./loadLabels";
import {loadMusic} from "./music";
import {loadMediaTexture} from "./mediaTexture";
import {showSection} from "./showSection";
import {handlePromiseCancellation} from "./utils/pissant/cancellationToken";
import {loadFaceDetectionModel} from "./loadFaceDetectionModel";

// (PIXI.settings as any).ROUND_PIXELS = true;
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

window.onload = initialize;

window.addEventListener("unhandledrejection", handleIguaPromiseRejection);
window.addEventListener("unhandledrejection", handlePromiseCancellation);

function pushStartButton()
{
    return new Promise<void>(resolve =>
        document.getElementById('start_button')!.onclick = () => resolve())
}

async function initialize() {
    try {
        showSection('loading');
        require("./utils/extensions/**/*.*");
        await loadLabels();
        await loadTextures();
        await loadMusic();
        await loadMediaTexture();
        await loadFaceDetectionModel();
        showSection('start');
        await pushStartButton();
        showSection('game');
        await require("./igua/game").startGame();
    }
    catch (e) {
        showSection('fatal_error');
        document.getElementById('fatal_error_message')!.textContent = `${e}`;
        throw e;
    }
}
