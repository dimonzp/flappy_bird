import { Text } from "pixi.js";
// import { FSM } from "../FSM";
import { GAME_WIDTH } from "../constants/constants";
import { FSM } from "../core/FSM";

export class Counter {
  private static _counter: Text = new Text(0, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xffffff,
    align: "center",
  });
  constructor() {
    Counter.execute();
  }
  private static execute() {
    const state = FSM.state;
    const stage = state.app!.stage;

    this._counter.anchor.set(1);
    this._counter.position.set(GAME_WIDTH - 2, 26);

    stage.addChild(this._counter);
  }
  public static increment() {
    this._counter.text = +this._counter.text + 1;
  }
  public static reset() {
    this._counter.text = 0;
  }
  static get count(): number {
    return +this._counter.text;
  }
}
