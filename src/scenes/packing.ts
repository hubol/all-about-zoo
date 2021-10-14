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
import {wait} from "pissant";
import {lyric} from "../showLyrics";
import {mediaTexture} from "../mediaTexture";
import {face} from "../fuckyou";

export function packing() {
    const mediaSprite = makeFullMediaSprite();
    mediaSprite.filters = [new RGBSplitFilter([-3, 0], [0, 3], [0, 0])];
    const mediaSprite2 = Sprite.from(mediaTexture).at(canvas.width - 128, canvas.height - 128).withStep(x => x.angle++);
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

    scene.addChild(holeSprite, hearts);
    const appleSprite = Sprite.from(textures.Apple);
    appleSprite.filters = [new DropShadowFilter()];
    scene.addChild(appleSprite.withStep(x => {
        x.x++;
        x.y++;
        x.y %= canvas.height;
        x.x %= canvas.width;
        const f = Math.sin(now.s);
        x.scale.set(f, f);
    }), mediaSprite2);
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

    setTimeout(async () => {
        await wait(() => lyric.indexOf('box') !== -1);
        const box = Sprite.from(textures.CardboardBox).at(canvas.width / 2, canvas.height / 2);
        box.scale.set(0, 0);
        box.withStep(() => {
            box.scale.set(Math.min(1, box.scale.x + 0.1));
        })
        scene.addChild(box);
    })
    scene.addChild(bouncer);

    scene.addChild(Sprite.from(textures.Apple).withStep(x => x.at(face.box)));
}
