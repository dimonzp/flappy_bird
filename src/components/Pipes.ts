import { Container, Sprite, Ticker } from "pixi.js";
import { GAME_HEIGHT, GAME_PARAMS, GAME_WIDTH, SPRITESHEET } from "../constants/constants";
import { FSM } from "../core/FSM";
import { getSprite } from "../utils/getSprite";
import { getNumberInRange } from "../utils/getNumberInRange";
import { Facade } from "../core/Facade";
import { Bird } from "./Bird";
import { Counter } from "./Counter";
import { Ground } from "./Ground";

export class Pipes {
  private _pipeDown: Sprite = getSprite(SPRITESHEET.PIPE_DOWN);
  private _pipeUp: Sprite = getSprite(SPRITESHEET.PIPE_UP);
  private _pipeContainer: Container = new Container();
  private _yMin: number = -this._pipeUp.height + 30;
  private _yMax: number = 0;

  constructor(private _x: number = 0) {
    this.execute();
  }
  private execute() {
    const state = FSM.state;
    const stage = state.app!.stage;

    this._setDefaultPosition();
    this._pipeContainer.width = this._pipeDown.width;
    this._pipeContainer.height = GAME_HEIGHT;

    this._pipeUp.position.set(0, 0);
    this._pipeDown.position.set(0, this._pipeUp.height + 50);
    this._pipeContainer.addChild(this._pipeDown);
    this._pipeContainer.addChild(this._pipeUp);

    stage.addChild(this._pipeContainer);

    this._initTicker();
  }

  private _setDefaultPosition() {
    const y = getNumberInRange(this._yMin, this._yMax);
    this._pipeContainer.position.set(GAME_WIDTH + this._x, y);
  }

  private _initTicker() {
    Ticker.shared.add(() => {
      const state = FSM.state.state;

      switch (state) {
        case "GAME":
          if (this._pipeContainer.x === -this._pipeUp.width) {
            this._pipeContainer.x = GAME_WIDTH;
            this._pipeContainer.y = getNumberInRange(this._yMin, this._yMax);
          } else {
            this._pipeContainer.x -= GAME_PARAMS.GROUND_SPEED;
          }
          this._checkBirdPosition();
          this._checkPipePosition();
          break;
        case "PREGAME":
          this._setDefaultPosition();
          Counter.reset();
        default:
          break;
      }
    });
  }

  private _checkBirdPosition() {
    const bird = Facade.getModel(Bird);
    const ground = Facade.getModel(Ground);
    const birdBounds = bird.bird.getBounds();
    const pipeUpBounds = this._pipeUp.getBounds();
    const pipeDownBounds = this._pipeDown.getBounds();
    const groundBounds = ground.ground.getBounds();

    if (
      pipeUpBounds.intersects(birdBounds) ||
      pipeDownBounds.intersects(birdBounds) ||
      groundBounds.intersects(birdBounds)
    ) {
      FSM.dispatch("gameOver");
    }
  }
  private _checkPipePosition() {
    if (this._pipeContainer.x === GAME_WIDTH / 2 - this._pipeContainer.width) {
      console.log(this._pipeContainer.x);
      Counter.increment();
    }
  }
}
