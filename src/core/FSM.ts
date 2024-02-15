import { Application } from "pixi.js";
import { InitApp } from "./initApp";

type TState = "INITIAL" | "PREGAME" | "GAME" | "GAMEOVER";
interface IState {
  state: TState;
  app: Application | null;
  isInitialized: boolean;
}

//finite state machine
export class FSM {
  private static _state: IState = {
    state: "INITIAL",
    app: null,
    isInitialized: false,

  };
  private static _transitions: {
    [key in TState]: {
      [key: string]: Function;
    };
  } = {
    INITIAL: {
      init: async () => {
        if (this._state.isInitialized) {
          throw new Error("APP already initialized");
        }
        this._state.app = new InitApp().getApp();
        await InitApp.startLoadingAssets();
        this._state.isInitialized = true;
  
        this.dispatch("startPregame");
      },
      startPregame: () => {
        this.changeState("PREGAME");
        this.dispatch("startPregame");
      }
    },
    PREGAME: {
      startPregame: () => {
        InitApp.onAssetsLoaded();
      },
      startGame: () => {
        this.changeState("GAME");
      }
    },
    GAME: {
      gameOver: () => {
        this.changeState("GAMEOVER");
      }
    },
    GAMEOVER: {
      restart: () => {
        this.changeState("PREGAME");
      }
    },
  };
  public static dispatch(actionName: string, ...payload: any[]) {
    const action = this._transitions[FSM.state.state][actionName];

    if (action) {
      action.apply(FSM, ...payload);
    } else {
      console.error("Action not found",action);
    }
  }
  private static changeState(newState: TState) {
    //validate that newState actually exists
    const indexNextState = Object.keys(this._transitions).findIndex((state) => state === newState);
    if (indexNextState === -1) {
      throw new Error("Invalid next state");
    }
    this._state.state = newState;
  }

  static get state() {
    return this._state;
  }

  public static init() {
    if (this._state.isInitialized) return;
    FSM.dispatch("init");
  }
}
