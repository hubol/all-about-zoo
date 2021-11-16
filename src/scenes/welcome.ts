import {canvas, scene} from "../igua/game";
import {Container, Graphics, Sprite, Texture } from "pixi.js-legacy";
import {faceTexture} from "../mediaTexture";
import {textures} from "../textures";
import {now} from "../utils/now";
import { range } from "../utils/range";
import Color from "color";
import {merge} from "../utils/merge";
import {lyric} from "../labels/showLyrics";

export function welcome() {
    const background = new Graphics().withStep(() => {
        background
            .clear()
            .beginFill(Color.hsv((now.s * 60) % 360, 255, 255).rgbNumber())
            .drawRect(0, 0, canvas.width, canvas.height);
    })

    const c0 = cylinder(5, 0x5AD3B9, 0xF2E98D).at(canvas.width * 0.7, canvas.height * 0.3);
    c0.scale.set((canvas.width * 0.6) / 40, (canvas.height * 0.2) / 40);
    const c1 = cylinder(2, 0x3ECAAA, 0xEFE575).at(canvas.width * 0.1, canvas.height * 0.5);
    c1.scale.set((canvas.width * 0.6) / 40, (canvas.height * 0.2) / 40);
    const c2 = cylinder().at(canvas.width * 0.3, canvas.height * 0.8);
    c2.scale.set((canvas.width * 0.5) / 32, (canvas.height * 0.4) / 32);

    const monkeys = spawner(textures.Monkey).at(canvas.width * 0.3, canvas.height * 0.4);
    const pandas = spawner(textures.Panda).at(canvas.width * 0.5, canvas.height * 0.6);
    const starfishes = spawner(textures.Elephant).at(canvas.width * 0.7, canvas.height * 0.8);

    const fg = new Container();
    fg.addChild(c0, monkeys, c1, pandas, starfishes, c2);

    scene.addChild(background, fg);

    let current;
    let lastLyric = "";
    let mode = 0;
    const list = [monkeys, pandas, starfishes];
    scene.withStep(() => {
        if (mode === 0) {
            if (lyric !== lastLyric) {
                lastLyric = lyric;
                if (current)
                    current.go = false;
                if (lyric !== "") {
                    const nextIndex = (list.indexOf(current) + 1) % list.length;
                    current = list[nextIndex];
                    current.go = true;
                }
            }
        }

        if (mode === 1) {
            monkeys.go = false;
            pandas.go = false;
            starfishes.go = false;
        }

        if (lyric.includes('died') || lyric.includes('sky') || lyric.includes('fly')) {
            mode = 1;
            monkeys.go = true;
            pandas.go = true;
            starfishes.go = true;
        }
    })

    range(30).forEach(i => {
        const character = makeCharacter(.2 + i * 0.01);
        scene.addChild(character.at(canvas.width * (Math.sin(i) + 1) * 0.3, canvas.height * (0.5 + i * .01)));
    });

    const character = makeCharacter();
    scene.addChild(character.at(canvas.width * 0.3, canvas.height * 0.9));
}

function flyer(texture: Texture) {
    const sprite = Sprite.from(texture);
    sprite.anchor.set(0.5, 0.5);
    sprite.width = canvas.width / 6;
    sprite.scale.y = sprite.scale.x;
    return sprite.withStep(() => {
        sprite.angle += 1;
        sprite.y -= 4;
        if (sprite.y < -canvas.height)
            sprite.destroy();
    });
}

function spawner(texture: Texture) {
    const container = merge(new Container(), { go: false });

    return container.withStep(() => {
        if (!container.go)
            return;
        container.addChild(flyer(texture));
    });
}

function makeCharacter(scale = 1) {
    const faceSprite = Sprite.from(faceTexture).withStep(() => {
        faceSprite.width = 128;
        faceSprite.height = 128;
        faceSprite.scale.x = Math.abs(faceSprite.scale.x) * -1;
    }).at(124, -306);

    const character = new Container().withStep(() => character.angle = Math.floor(Math.sin(now.s * Math.PI * 2) + 1) * 4);
    character.scale.set((canvas.width / 1500) * scale);
    const hole = Sprite.from(textures.FaceHole);
    hole.scale.set(1.75);
    hole.anchor.set(102 / hole.texture.width, 237 / hole.texture.height);
    const shadow = Sprite.from(textures.Shadow);
    shadow.width = hole.width;
    shadow.scale.y = shadow.scale.x;
    character.addChild(shadow, faceSprite, hole);

    return character;
}

function cylinder(height = 2, topColor = 0x23C29C, bottomColor = 0xEDE15E) {
    const graphics = new Graphics();
    const scale = 32;
    graphics
        .beginFill(bottomColor)
        .drawRect(-1 * scale, 0, 2 * scale, height * scale)
        .beginFill(topColor)
        .drawEllipse(0, 0, 1 * scale, 0.5 * scale);
    return graphics;
}
