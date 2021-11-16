import {
    DropShadowFilter
} from "pixi-filters";
import {canvas, makeFullMediaSprite, scene} from "../igua/game";
import {range} from "../utils/range";
import {textures} from "../textures";
import {Container, Graphics, Sprite } from "pixi.js-legacy";
import {face} from "../faceDetection";
import {distance} from "../utils/math/vector";
import {now} from "../utils/now";

export function elephants() {
    makeFullMediaSprite();

    const sky = new Graphics();
    scene.addChild(sky);

    const sprites = range(30).map(() => {
        const sprite = Sprite.from(textures.Cloud).at(canvas.width * Math.random(), canvas.height * Math.random() * 0.6);
        sprite.anchor.set(0.5, 0.5);
        sprite.width = canvas.width / (4 + Math.random() * 3);
        sprite.scale.y = sprite.scale.x;
        return sprite;
    });

    const speed = 2;

    const clouds = new Container();

    scene.withStep(() => {
        const center = { x: face.box.x + face.box.width / 2, y: face.box.y + face.box.height / 2};
        const radius = (Math.abs(face.box.width) + Math.abs(face.box.height)) / 4;

        sky
            .clear()
            .beginFill(0xA3C9F7)
            .drawRect(0, 0, canvas.width, canvas.height)
            .beginHole()
            .drawCircle(center.x, center.y, radius);

        sprites.forEach(x => {
            x.moveTowards({ x: canvas.width * (.1 + Math.random() * .8), y: canvas.height * (.1 + Math.random() * .8) }, Math.random() * 0.125);
            x.alpha = Math.max(1 - ((x.y - 256) / canvas.height), 0.2);
            if (distance(x, center) < radius) {
                if (x.x < center.x)
                    x.x -= speed;
                if (x.x > center.x)
                    x.x += speed;
                if (x.y < center.y)
                    x.y -= speed;
                if (x.y > center.y)
                    x.y += speed;
            }
        });
    });

    function terrain(x) {
        return canvas.height * .75 + Math.sin(x * .005) * Math.cos(x * .04 + 3) * 32;
    }

    function elephant() {
        const seed = Math.random() * Math.PI * 2;
        const sprite = Sprite.from(textures.Elephant).withStep(() => {
            sprite.x -= 0.5;
            sprite.angle = Math.round(Math.sin(now.s * 3 + seed) * 2) * 3;
            sprite.y = terrain(sprite.x);
            if (sprite.x < -sprite.width)
                sprite.x = canvas.width + sprite.width;
        });
        sprite.width = canvas.width / 4;
        sprite.scale.y = sprite.scale.x;
        sprite.anchor.set(0.5, 0.8);
        return sprite;
    }

    const earth = new Graphics().beginFill(0xa00000);
    const samples = 128;
    for (let i = 0; i <= samples; i++)
    {
        const x = (i / samples) * scene.width;
        const y = terrain(x);
        if (i === 0)
            earth.moveTo(x, y);
        else
            earth.lineTo(x, y);
    }
    earth.lineTo(scene.width, scene.height)
    earth.lineTo(0, scene.height)

    clouds.filters = [ new DropShadowFilter({ distance: 8, blur: 8, quality: 5, color: 0x21357A }) ];
    clouds.addChild(...sprites);

    const foreground = new Container();
    foreground.addChild(earth, elephant(), elephant().at(canvas.width / 2, 0));

    scene.addChild(foreground, clouds);
}
