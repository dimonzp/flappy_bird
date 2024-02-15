import { AnimatedSprite, Ticker } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH, SPRITESHEET } from "../constants/constants";
import { FSM } from "../core/FSM";
// import { FSM } from "../FSM";
import { getAnimatedSprite } from "../utils/getAnimatedSprite";

export class Bird {
  private _bird: AnimatedSprite = getAnimatedSprite(
    [SPRITESHEET.BIRD_UP, SPRITESHEET.BIRD_MIDDLE, SPRITESHEET.BIRD_DOWN],
    0.1
  );

  private _gravity: number = 1.2;
  private _jump: number = 13;
  private _moveUp: boolean = false;
  private _moveUpDistance: number = this._jump;
  private _freezeRotationDistance: number = this._jump * 1.2;

  private _birdUpPregame: boolean = true;
  private _birdUpPregameDistance: number = 30;
  private _birdPregameGravity: number = this._gravity / 5;

  constructor() {
    this.execute();
  }
  private execute() {
    const state = FSM.state;
    const stage = state.app!.stage;

    this._bird.anchor.set(0.5);
    this.setDefaultPosition();

    stage.addChild(this._bird);
    this._initTicker();
    this._addListeners();
  }

  private _addListeners() {
    const state = FSM.state;
    window.addEventListener("touchstart", this._onCanvasClick.bind(this));
    window.addEventListener("click", this._onCanvasClick.bind(this));
    window.addEventListener("keydown", this._onCanvasClick.bind(this));
  }
  private _onCanvasClick(e: any) {
    e.preventDefault();
    const state = FSM.state;
    if (state.state === "GAMEOVER") return;
    if (state.state === "PREGAME") {
      FSM.dispatch("startGame");
    }

    if (state.state === "GAME") {
      if (this._moveUp) {
        const jump = Math.min(this._moveUpDistance + this._jump, this._jump * 1.5);
        this._moveUpDistance = jump;
      } else {
        this._moveUp = true;
        this._freezeRotationDistance = this._jump * 1.2;
      }
    }
  }

  private _initTicker() {
    const state = FSM.state;
    const birdUpPregameDistance = this._birdUpPregameDistance;
    Ticker.shared.add(() => {
      switch (state.state) {
        case "PREGAME":
          this._birdPregameBehavior(birdUpPregameDistance);
          break;
        case "GAME":
          this._birdGameBehavior();
          break;
        case "GAMEOVER":
          this._birdGameOverBehavior();
          break;

        default:
          break;
      }
    });
  }
  private _birdPregameBehavior(birdUpPregameDistance: number): void {
    if (!this._bird.playing) {
      this._bird.play();
    }
    if (this._birdUpPregame) {
      this._bird.y -= this._birdPregameGravity;
      this._birdUpPregameDistance -= 1;
    } else {
      this._bird.y += this._birdPregameGravity;
      this._birdUpPregameDistance -= 1;
    }
    if (this._birdUpPregameDistance <= 0) {
      this._birdUpPregame = !this._birdUpPregame;
      this._birdUpPregameDistance = birdUpPregameDistance;
    }
  }
  private _birdGameBehavior(): void {
    this._bird.y += this._gravity;
    if (this._moveUp) {
      this._bird.y -= this._gravity * 2.2;
      this._bird.rotation = (-30 * Math.PI) / 180;
      this._moveUpDistance -= 1;
    } else {
      if (this._freezeRotationDistance <= 0) {
        const rotation = this._bird.rotation + (10 * Math.PI) / 180;
        this._bird.rotation = Math.min(rotation, 1.2);
      } else {
        this._freezeRotationDistance -= 1;
      }
    }
    if (this._moveUpDistance <= 0) {
      this._moveUp = false;
      this._moveUpDistance = this._jump;
    }
  }
  private _birdGameOverBehavior(): void {
    this._bird.stop();
  }

  public setDefaultPosition() {
    console.log("setDefaultPosition");
    
    this._bird.position.set(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    this._bird.rotation = 0;
  }

  public get bird(): AnimatedSprite {
    return this._bird;
  }
}
