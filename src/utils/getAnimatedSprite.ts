import { AnimatedSprite, Texture } from "pixi.js";

export const getAnimatedSprite = (
  spriteNames: string[],
  animationSpeed: number,
  loop: boolean = true
): AnimatedSprite => {
  const textures = spriteNames.map((spriteName) => Texture.from(spriteName));
  const sprite = new AnimatedSprite(textures);
  sprite.loop = loop;
  sprite.animationSpeed = animationSpeed;
  sprite.play();
  return sprite;
};
