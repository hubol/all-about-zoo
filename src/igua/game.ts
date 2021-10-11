import {Container} from "pixi.js";
import {AsshatTicker} from "../utils/asshatTicker";
import {advanceKeyListener, startKeyListener} from "../utils/browser/key";
import {AsshatApplication} from "../utils/pixi/createApplication";

export let game: ReturnType<typeof createGame>;

export let scene: Container;

function createGame(application: AsshatApplication)
{
    application.ticker.start();
    application.stage.withTicker(new AsshatTicker());
    scene = application.stage;

    startKeyListener();

    application.ticker.add(() => {
        advanceKeyListener();
        scene.ticker.update();
    });
}
