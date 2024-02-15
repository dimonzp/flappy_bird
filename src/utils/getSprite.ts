import { Sprite, Texture } from "pixi.js";

export const getSprite = (spriteName: string): Sprite => {
  return new Sprite(Texture.from(spriteName));
};
