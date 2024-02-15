import { Container, Graphics, Sprite, Ticker } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH, SPRITESHEET } from "../constants/constants";
import { FSM } from "../core/FSM";
import { getSprite } from "../utils/getSprite";

export class Intro {
  private _ticker: Ticker = Ticker.shared;
  private _flappyText: Sprite = getSprite(SPRITESHEET.FLAPPY_TEXT);
  private _birdText: Sprite = getSprite(SPRITESHEET.BIRD_TEXT);
  private _logoContainer: Container = new Container();
  private _background: Graphics = new Graphics()
    .beginFill(0x87ceeb)
    .drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
    .endFill();

  constructor() {
    this.execute();
  }
  private execute() {
    const state = FSM.state;
    const stage = state.app!.stage;
    const textWidth = this._flappyText.width + this._birdText.width;
    this._logoContainer.position.set(
      GAME_WIDTH / 2 - textWidth / 2,
      GAME_HEIGHT / 2 - textWidth / 2
    );
    this._flappyText.position.set(0, 0);
    this._birdText.position.set(this._flappyText.width, 0);
    this._logoContainer.addChild(this._flappyText);
    this._logoContainer.addChild(this._birdText);
    stage.addChild(this._background);
    stage.addChild(this._logoContainer);

    this._initTicker();
  }

  private _initTicker() {
    this._ticker.add(this._tickerFunc);
  }
  private _tickerFunc = () => {
    if (this._background.alpha > 0) {
      this._background.alpha = Math.max(this._background.alpha - 0.015, 0);
    }
    if (this._background.alpha === 0) {
      if (this._logoContainer.x > 5) {
        this._logoContainer.x -= 1;
      }
      if (this._logoContainer.y > 5) {
        this._logoContainer.y -= 3.5;
      }
      if (this._logoContainer.scale.x > 0.5) {
        this._logoContainer.scale.x -= 0.02;
        this._logoContainer.scale.y -= 0.02;
      }
      if (
        this._logoContainer.scale.x <= 0.5 &&
        this._logoContainer.x <= 5 &&
        this._logoContainer.y <= 5
      ) {
        this._ticker.remove(this._tickerFunc);
      }
    }
  };
}
