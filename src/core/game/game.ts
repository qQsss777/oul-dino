import type Actor from "../actor/actor";
import type Asset from "../asset/asset";
import type Scene from "../scene/scene";
import { emitEvent } from "../utils/EventDecorator";
import EventEmitter from "../utils/EventEmitter";

interface IGameConstructor {
  scene: Scene;
  player: Actor;
  enemys: Actor[];
}

interface IGameProperties extends IGameConstructor {
  askUpdate: (deltaTime: number) => void;
  updateLevel: () => void;
  updateAsset: <K extends keyof Asset>(
    asset: Asset,
    key: K,
    value: Asset[K],
  ) => void;
}

export default class Game extends EventEmitter implements IGameProperties {
  scene: Scene;
  player: Actor;
  enemys: Actor[];
  lastTimeUpdate = 0;

  constructor(properties: IGameConstructor) {
    super();
    this.scene = properties.scene;
    this.player = properties.player;
    this.enemys = properties.enemys;
  }

  @emitEvent("udapte-asked")
  askUpdate(deltaTime: number) {
    this.lastTimeUpdate = this.lastTimeUpdate + deltaTime;
  }

  @emitEvent("changed")
  updateLevel() {
    console.log("ooo");
  }

  @emitEvent("changed")
  updateAsset<L, K extends keyof L>(asset: L, key: K, value: L[K]) {
    asset[key] = value;
  }
}
