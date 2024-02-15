import { Assets, Application } from "pixi.js";
import type PIXI from "pixi.js";
import { Facade } from "./Facade";
import { Bird } from "../components/Bird";
import { GAME_PARAMS } from "../constants/constants";
import { Pipes } from "../components/Pipes";
import { Intro } from "../components/Intro";
import { Ground } from "../components/Ground";
import { Counter } from "../components/Counter";
import { GameOver } from "../components/GameOver";
import { PipesNext } from "../components/PipesNext";
import { Background } from "../components/Background";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants/constants";

export class InitApp {
  private PIXI_APP = {} as { app: PIXI.Application };
  static progress: number;

  public static async startLoadingAssets(): Promise<void> {
    return new Promise((resolve) => {
      Assets.add("sprites", "./assets/spriteSheets/spritesData.json");
      Assets.load(["sprites"], (progress: number) => {
        console.log(progress);

        this.progress = progress;
      }).then(() => resolve());
    });
  }

  public static onAssetsLoaded(): void {
    //add models to facade here
    Facade.addModels([
      [Background, []],
      [Pipes, []],
      [PipesNext, [GAME_PARAMS.PIPE_DISTANCE]],
      [Ground, []],
      [Bird, []],
      [GameOver, []],
      [Counter, []],
      [Intro, []],
    ]);
  }

  private setSize(): void {
    this.PIXI_APP.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.PIXI_APP.app.stage.scale.x = window.innerWidth / GAME_WIDTH;
    this.PIXI_APP.app.stage.scale.y = window.innerHeight / GAME_HEIGHT;
  }
  private onResize(): void {
    this.PIXI_APP.app && this.setSize();
  }

  public getApp(): PIXI.Application {
    if (!this.PIXI_APP.app) {
      this.PIXI_APP.app = new Application({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
      });
      
      document.body.appendChild(this.PIXI_APP.app.view as any);
      window.addEventListener("resize", this.onResize.bind(this));
      this.setSize();
      if (process.env.NODE_ENV === "development") {
        // add global variable for turn on debugging tools
        // @ts-ignore
        globalThis.__PIXI_APP__ = this.PIXI_APP.app;
      }
    }
    return this.PIXI_APP.app;
  }
}
