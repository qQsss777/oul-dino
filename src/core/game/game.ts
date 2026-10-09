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
  updateScene(): void;
  updateLevel(): void;
  hasSceneUpdate(): boolean;
  notifyInput(inputName: InputName): void;
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

  notifyInput(inputName: InputName) {
    const inputPayload: IInputNotification = {
      name: inputName,
      data: {
        distance: 0.5,
        speed: 0.01,
      },
    };
    // prepare new data and update first update
    this.scene.notifyInputs(inputPayload);
  }

  updateScene(): void {
    this.scene.update();
    this.emit("updated");
  }

  hasSceneUpdate(): boolean {
    return this.scene.isUpdating();
  }
}
