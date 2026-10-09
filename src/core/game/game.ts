import type { InputName } from "../input/input";
import type { IInputNotification } from "../scene/scene";
import type Scene from "../scene/scene";
import { emitEvent } from "../utils/decorator/EventDecorator";
import EventEmitter from "../utils/event/EventEmitter";

interface IGameConstructor {
  scene: Scene;
  levelManager: any;
  sessionManager: any;
}

interface IGameProperties extends IGameConstructor {
  requestUpdate(deltaTime: number): void;
  updateLevel(): void;
  notifyInput(inputPayloads: IInputNotification[]): void;
}

export default class Game extends EventEmitter implements IGameProperties {
  scene: Scene;
  lastTimeUpdate = 0;
  levelManager: any;
  sessionManager: any;

  constructor(properties: IGameConstructor) {
    super();
    this.scene = properties.scene;
  }

  @emitEvent("update-request")
  requestUpdate(deltaTime: number) {
    this.lastTimeUpdate = this.lastTimeUpdate + deltaTime;
  }

  @emitEvent("level-changed")
  updateLevel() {
    console.log("ooo");
  }

  notifyInputs(inputPayloads: IInputNotification[]) {
    // prepare new data and update first update
    inputPayloads.forEach((ip) => {
      this.scene.notifyInputs(ip);
    });
  }
}
