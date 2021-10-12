import {Loader, Texture } from "pixi.js-legacy";

const textureRequires = {
    LunchFaceHole: require('./images/lunch face hole.png'),
    Apple: require('./images/apple.png'),
    Dummy: require('./images/dummy.png'),
};

type Key = keyof typeof textureRequires;

export function loadTextures() {
    const loader = new Loader();
    loader.add(Object.values(textureRequires));
    return new Promise<void>(resolve => {
       loader.load((_, resources) => {
           Object.entries(textureRequires).forEach(([key, path]) => {
              textures[key] = resources[path]?.texture;
           });
           resolve();
       })
    });
}

export let textures = {} as { [key in Key]: Texture }
