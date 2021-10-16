import {canvas, scene} from "../igua/game";
import {Container, Graphics, Sprite } from "pixi.js-legacy";
import {faceTexture} from "../mediaTexture";
import {textures} from "../textures";
import {now} from "../utils/now";
import { range } from "../utils/range";

export function welcome() {
    const c0 = cylinder(5, 0x5AD3B9, 0xF2E98D).at(canvas.width * 0.7, canvas.height * 0.3);
    c0.scale.set((canvas.width * 0.6) / 40, (canvas.height * 0.2) / 40);
    const c1 = cylinder(2, 0x3ECAAA, 0xEFE575).at(canvas.width * 0.1, canvas.height * 0.5);
    c1.scale.set((canvas.width * 0.6) / 40, (canvas.height * 0.2) / 40);
    const c2 = cylinder().at(canvas.width * 0.3, canvas.height * 0.8);
    c2.scale.set((canvas.width * 0.5) / 32, (canvas.height * 0.4) / 32);
    scene.addChild(c0, c1, c2);

    range(30).forEach(i => {
        const character = makeCharacter(.2 + i * 0.01);
        scene.addChild(character.at(canvas.width * (Math.sin(i) + 1) * 0.3, canvas.height * (0.5 + i * .01)));
    });

    const character = makeCharacter();
    scene.addChild(character.at(canvas.width * 0.3, canvas.height * 0.9));
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
