import { AnimatedSprite, Container, Sprite, Ticker } from "pixi.js";
import { GAME_HEIGHT, GAME_PARAMS, GAME_WIDTH, SPRITESHEET } from "../constants/constants";
import { FSM } from "../core/FSM";
// import { FSM } from "../FSM";
import { getAnimatedSprite } from "../utils/getAnimatedSprite";
import { getSprite } from "../utils/getSprite";

export class Background {
  
  private _background: Sprite = getSprite(SPRITESHEET.BACKGROUND);

  constructor() {
    this.execute();
  }
  private execute() {
    const state = FSM.state;
    const stage = state.app!.stage;
    this._background.name = "background";
    this._background = getSprite(SPRITESHEET.BACKGROUND);
    this._background.position.set(0, 0);

    stage.addChild(this._background);
  }
}
