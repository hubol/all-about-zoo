import {Container, Graphics, Sprite} from "pixi.js-legacy";
import Color from "color";
import {now} from "../utils/now";
import {canvas, scene} from "../igua/game";
import {textures} from "../textures";
import {sleep} from "../cutscene/sleep";
import {faceTexture} from "../mediaTexture";
import {DropShadowFilter} from "pixi-filters";

export function koala() {
    const background = new Graphics()
        .beginFill(Color('#2d5e4c').rgbNumber())
        .drawRect(0, 0, canvas.width, canvas.height);

    const container = new Container().at(canvas.width / 2, canvas.height * .9);
    container.filters = [new DropShadowFilter()];
    const k = Sprite.from(textures.SleepingKoala);
    k.anchor.set(0.5, 1);
    k.width = canvas.width / 2;
    k.scale.y = k.scale.x;

    const bubble = new Graphics().withStep(() => {
        const max = k.width / 16;
        bubble
            .clear()
            .beginFill(0xD6B1CD)
            .drawEllipse(k.width / 4, -k.height / 1.5, (Math.sin(now.s) + 2) * max, (Math.cos(now.s + 0.5) + 2) * max);
    }).withAsync(async () => {
        while (true) {
            container.addChild(z().at(0, -k.height));
            await sleep(2000);
        }
    });

    function z() {
        let seed = now.s;
        const sprite = Sprite.from(textures.Zed).withStep(() => {
            sprite.x += Math.sin(now.s + (seed += 0.05));
            sprite.y--;
            if (sprite.y < -sprite.height - canvas.height)
                sprite.destroy();
        });

        sprite.anchor.x = 2;
        sprite.width = canvas.width / 12;
        sprite.scale.y = sprite.scale.x;

        return sprite;
    }

    const faceSprite = Sprite.from(faceTexture).withStep(() => {
        faceSprite.width = canvas.width / 8;
        faceSprite.height = faceSprite.width;
        faceSprite.scale.x = Math.abs(faceSprite.scale.x) * -1;
    }).at(canvas.width, 0);

    container.addChild(k, bubble);

    scene.addChild(background, faceSprite, container);
}
