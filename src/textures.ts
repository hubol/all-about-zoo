import {Loader, SCALE_MODES, Texture} from "pixi.js-legacy";
import {textureRequires} from "./textureRequires";

type Key = keyof typeof textureRequires;

export function loadTextures() {
    const loader = new Loader();
    loader.add(Object.values(textureRequires));
    return new Promise<void>(resolve => {
       loader.load((_, resources) => {
           Object.entries(textureRequires).forEach(([key, path]) => {
              textures[key] = resources[path]?.texture;
           });
           textures.Shadow.defaultAnchor.set(0.5);
           resolve();
       })
    });
}

export let textures = {} as { [key in Key]: Texture }
