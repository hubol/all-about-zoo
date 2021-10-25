import {
    AdjustmentFilter,
    DropShadowFilter,
    OutlineFilter,
    RGBSplitFilter
} from "pixi-filters";
import {Container, filters, Sprite} from "pixi.js-legacy";
import {textures} from "../textures";
import {now} from "../utils/now";
import {canvas, makeFullMediaSprite, scene} from "../igua/game";
import {lyric} from "../labels/showLyrics";
import {mediaTexture} from "../mediaTexture";
import {face} from "../faceDetection";
import { lerp } from "../utils/math/number";
import {wait} from "../cutscene/wait";
import {message} from "../labels/broadcastMessages";

export function packing() {
    const mediaSprite = makeFullMediaSprite();
    mediaSprite.filters = [new RGBSplitFilter([-3, 0], [0, 3], [0, 0])];

    const flower = Sprite.from(textures.Flower).withStep(() => {
        flower.at(face.box).add(face.box.width / 2, face.box.height / 2);
        flower.width = face.box.width * 1.5;
        flower.height = face.box.height * 1.75;
    })
    flower.anchor.set(.45, .6);
    flower.filters = [ new DropShadowFilter({ distance: 5, blur: 8 }) ];
    scene.addChild(flower);

    const mediaSprite2 = Sprite.from(mediaTexture).at(128, 128).withStep(x => x.angle++);
    mediaSprite2.anchor.set(0.5, 0.5);
    mediaSprite2.scale.set(0.3, 0.3);
    mediaSprite2.filters = [new AdjustmentFilter({ saturation: 2, brightness: 2, contrast: 0.75 }), new OutlineFilter(8, 0xDB5C8C), new DropShadowFilter({ color: 0x00ff00 })];
    const holeSprite = Sprite.from(textures.LunchFaceHole);
    const s = canvas.width / textures.LunchFaceHole.width;
    holeSprite.scale.set(s, s);

    const hearts = new Container().withStep(() => {
        if (lyric.indexOf('love') !== -1) {
            hearts.alpha = 1;
            const heart = Sprite.from(textures.Heart).at(Math.random() * canvas.width, Math.random() * canvas.height);
            heart.scale.set(canvas.width / 4000);
            hearts.addChild(heart);
        }
        else if (hearts.alpha > 0) {
            hearts.alpha -= .005;
        }
        else if (hearts.children.length > 0)
            hearts.removeAllChildren();
    })

    scene.addChild(hearts);
    const appleSprite = Sprite.from(textures.Apple);
    appleSprite.filters = [new DropShadowFilter()];
    scene.addChild(mediaSprite2);
    const hueShift = new filters.ColorMatrixFilter();
    const bouncer = Sprite.from(textures.PurpleGuy).at(0, canvas.height);
    const shadow = new DropShadowFilter();
    bouncer.filters = [hueShift, shadow];
    bouncer.anchor.set(0.5, 1);
    bouncer.withStep(() => {
        bouncer.x++;
        if (bouncer.x > canvas.width + bouncer.width)
            bouncer.x = -bouncer.width;
        bouncer.y = canvas.height - Math.abs(Math.sin(now.s * 4)) * 18;
        shadow.distance = Math.max(3, (bouncer.y - canvas.height) * 0.2 + 12);
        bouncer.scale.y = 1 - Math.abs(Math.cos(now.s * 4)) * 0.1;
        hueShift.hue((now.s * 360) % 360, false);
    })

    scene.withAsync(async () => {
        await message('box');
        const box = Sprite.from(textures.CardboardBox).at(canvas.width / 2, canvas.height / 2);
        box.scale.set(0, 0);
        box.anchor.set(0.5, 1);
        box.withStep(() => {
            box.scale.set(Math.min(1, box.scale.x + 0.1));
            box.angle = lerp(box.angle, 0, 0.1);
            const xPrev = box.x;
            box.x = lerp(box.x, face.box.x + face.box.width / 2, 0.5);
            const diff = box.x - xPrev;
            box.angle -= Math.min(20, Math.abs(diff)) * Math.sign(diff);
            box.y = face.box.y;
        })
        scene.addChild(box);
    })
    scene.addChild(bouncer);

    // scene.addChild(Sprite.from(textures.Apple).withStep(x => x.at(face.box)));
}
