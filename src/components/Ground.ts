import { Container, Sprite, Ticker } from "pixi.js";
import { GAME_HEIGHT, GAME_PARAMS, SPRITESHEET } from "../constants/constants";
import { FSM } from "../core/FSM";
import { getSprite } from "../utils/getSprite";

export class Ground {
  private _ground: Sprite = getSprite(SPRITESHEET.GROUND);
  private _ground2: Sprite = getSprite(SPRITESHEET.GROUND);
  private _groundContainer: Container = new Container();

  constructor() {
    this.execute();
  }
  private execute() {
    const state = FSM.state;
    const stage = state.app!.stage;

    this._ground.position.set(0, GAME_HEIGHT - this._ground.height);
    this._ground2.position.set(
      this._ground.width,
      GAME_HEIGHT - this._ground.height
    );

    this._groundContainer.name = "ground";
    this._groundContainer.addChild(this._ground);
    this._groundContainer.addChild(this._ground2);

    stage.addChild(this._groundContainer);

    this._initTicker();
  }

  private _initTicker() {
    Ticker.shared.add(() => {
      if (FSM.state.state === "GAMEOVER") return;

      if (this._groundContainer.x === -this._ground.width) {
        this._groundContainer.x = 0;
      } else {
        this._groundContainer.x -= GAME_PARAMS.GROUND_SPEED;
      }
    });
  }
  get ground(): Container {
    return this._groundContainer;
  }
}
