import { Sprite, Ticker, Text, Graphics } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH, SPRITESHEET } from "../constants/constants";
import { FSM } from "../core/FSM";
import { getSprite } from "../utils/getSprite";
import { Bird } from "./Bird";
import { Counter } from "./Counter";
import { Facade } from "core";

export class GameOver {
  private _gameText: Sprite = getSprite(SPRITESHEET.GAME_TEXT);
  private _overText: Sprite = getSprite(SPRITESHEET.OVER_TEXT);
  private _gameOver: Sprite = getSprite(SPRITESHEET.GAME_OVER);
  private _silverMedal: Sprite = getSprite(SPRITESHEET.SILVER_MEDAL);
  private _bronzeMedal: Sprite = getSprite(SPRITESHEET.BRONZE_MEDAL);
  private _goldMedal: Sprite = getSprite(SPRITESHEET.GOLD_MEDAL);
  private _score: Text = new Text("", {
    fontFamily: "Arial",
    fontSize: 10,
    fontWeight: "600",
    fill: 0x000000,
    align: "center",
  });
  private _bestScore: Text = new Text("", {
    fontFamily: "Arial",
    fontSize: 10,
    fontWeight: "600",
    fill: 0x000000,
    align: "center",
  });

  private _button: Graphics = new Graphics()
    .lineStyle(1, 0x381302, 1)
    .beginFill(0xfda91b, 1)
    .drawRect(0, 0, 20, 10)
    .endFill();

  constructor() {
    this.execute();
  }
  private execute() {
    const state = FSM.state;
    const stage = state.app!.stage;

    this._gameOver.position.set(
      GAME_WIDTH / 2 - this._gameOver.width / 2,
      GAME_HEIGHT / 2 - this._gameOver.height / 2
    );
    this._gameOver.alpha = 0;
    const medalX = 14;
    const medalY = 21;
    const scoreX = this._gameOver.width - 10;
    const scoreY = 27;
    const bestScoreY = 47;
    this._silverMedal.position.set(medalX, medalY);
    this._bronzeMedal.position.set(medalX, medalY);
    this._goldMedal.position.set(medalX, medalY);

    this._score.anchor.set(1);
    this._bestScore.anchor.set(1);
    this._score.position.set(scoreX, scoreY);
    this._bestScore.position.set(scoreX, bestScoreY);

    this._bronzeMedal.visible = false;
    this._silverMedal.visible = false;
    this._goldMedal.visible = false;
    this._bestScore.visible = false;
    this._score.visible = false;

    this._gameText.position.set(5, -this._gameText.height - 5);
    this._overText.position.set(
      this._gameText.x + this._gameText.width + 10,
      -this._overText.height - 5
    );

    this._button.position.set(
      this._gameOver.width / 2 - this._button.width / 2,
      this._gameOver.height - this._button.height - 5
    );

    const buttonText = new Text("PLAY", {
      fontSize: 6,
      fontWeight: "600",
    });
    buttonText.position.set(
      this._button.width / 2 - buttonText.width / 2,
      this._button.height / 2 - buttonText.height / 2
    );
    this._button.addChild(buttonText);
    // this._button.interactive = true;
    this._button.ontouchend = this._button.onclick = this._onButtonTap.bind(this);

    this._gameOver.addChild(this._score);
    this._gameOver.addChild(this._bestScore);
    this._gameOver.addChild(this._bronzeMedal);
    this._gameOver.addChild(this._silverMedal);
    this._gameOver.addChild(this._goldMedal);
    this._gameOver.addChild(this._gameText);
    this._gameOver.addChild(this._overText);
    this._gameOver.addChild(this._button);
    stage.addChild(this._gameOver);

    this._initTicker();
  }

  private _onButtonTap(e: any) {
    e.preventDefault();
    const bird = Facade.getModel(Bird);
    bird.setDefaultPosition();
    FSM.dispatch("restart");
  }
  private _initTicker() {
    const state = FSM.state;

    Ticker.shared.add(() => {
      switch (state.state) {
        case "GAMEOVER":
          if (this._gameOver.alpha < 1) {
            this._gameOver.alpha = Math.min(1, this._gameOver.alpha + 0.1);
          }
          if (this._gameOver.alpha === 1 && !this._isMedalVisible()) {
            this._showScore();
            this._showBestScore();
            this._showMedal();
          }
          this._button.interactive = true;
          break;
        case "PREGAME":
          if (this._gameOver.alpha >= 0) {
            this._gameOver.alpha -= 0.1;
          }
          this._hideMedal();
          this._button.interactive = false;
          break;
        default:
          this._gameOver.alpha = 0;
          this._button.interactive = false;
          break;
      }
    });
  }

  private _showMedal() {
    const count = Counter.count;
    if (count >= 20) {
      this._goldMedal.visible = true;
    } else if (count >= 10) {
      this._silverMedal.visible = true;
    } else {
      this._bronzeMedal.visible = true;
    }
  }

  private _hideMedal() {
    this._bronzeMedal.visible = false;
    this._silverMedal.visible = false;
    this._goldMedal.visible = false;
  }

  private _isMedalVisible() {
    return (
      this._bronzeMedal.visible ||
      this._silverMedal.visible ||
      this._goldMedal.visible
    );
  }

  private _showScore() {
    this._score.text = Counter.count;
    this._score.visible = true;
  }

  private _showBestScore() {
    let bestScore = localStorage.getItem("bestScore")
      ? +localStorage.getItem("bestScore")!
      : 0;

    if (Counter.count > bestScore) {
      this._updateBestScore(bestScore);
      bestScore = Counter.count;
    }
    this._bestScore.text = bestScore;
    this._bestScore.visible = true;
  }

  private _updateBestScore(score: number) {
    localStorage.setItem("bestScore", score.toString());
  }
}
