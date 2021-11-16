import {canvas, makeFullMediaSprite, scene} from "../igua/game";
import {DropShadowFilter, ReflectionFilter} from "pixi-filters";
import {now} from "../utils/now";
import {BLEND_MODES, Container, Graphics, Sprite} from "pixi.js-legacy";
import Color from "color";
import {textures} from "../textures";
import {range} from "../utils/range";
import {lyric} from "../labels/showLyrics";
import {wait} from "../cutscene/wait";
import {lerp} from "../cutscene/lerp";

export function aquarium() {
    const media = makeFullMediaSprite();
    const reflection = new ReflectionFilter({boundary: 0.7});
    media.filters = [reflection];
    scene.withStep(() => reflection.time = now.s % 360);
    const graphics = new Graphics()
        .beginFill(Color("#4677B5").rgbNumber())
        .drawRect(0, canvas.height * .7, canvas.width, canvas.height);
    graphics.blendMode = BLEND_MODES.ADD;
    graphics.alpha = 0.5;
    const [fishes, water] = range(2).map(() => new Container());
    scene.addChild(fishes, water);
    water.addChild(graphics);
    fishes.addChild(
        animal('Anemone').at(canvas.width * 0.4, canvas.height * 0.95),
        animal('Anemone').at(canvas.width * 0.99, canvas.height * 0.925),
        animal('Anemone').at(canvas.width * 0.1, canvas.height * 0.9),
        animal('Anemone').at(canvas.width * 0.7, canvas.height * 0.975),
        animal('Anemone').at(canvas.width * 0.6, canvas.height * 0.9),
        animal('Anemone').at(canvas.width * 0.2, canvas.height * 0.975),
        animal().at(canvas.width * 0.2, canvas.height * 0.9),
        animal().at(canvas.width * 0.75, canvas.height * 0.8),
        animal().at(canvas.width * 0.875, canvas.height * 0.9))
    fishes.filters = [new DropShadowFilter()];
    const blackout = new Graphics().beginFill(0).drawRect(0, 0, canvas.width, canvas.height).withAsync(async () => {
        await wait(() => lyric.includes('darkness'));
        lerp(blackout, 'alpha').to(1).over(500);
        await wait(() => lyric.includes('serious'));
        await lerp(blackout, 'alpha').to(0).over(500);
        blackout.destroy();
    });
    blackout.blendMode = BLEND_MODES.MULTIPLY;
    blackout.alpha = 0;
    scene.addChild(blackout);
}

function animal(style = 'StarFish') {
    const sprite = Sprite.from(textures[style]);
    sprite.width = canvas.width * 0.2;
    sprite.scale.y = sprite.scale.x;
    sprite.anchor.set(0.5, 0.5);
    const seed = Math.random() * 2;
    sprite.withStep(() => {
       sprite.angle = Math.floor((now.s + seed) % 2) * 8;
    });
    return sprite;
}
