import type Actor from "../actor";
import type Scene from "../scene";
import { emitEvent } from "../utils/EventDecorator";
import EventEmitter from "../utils/EventEmitter";

interface IGameConstructor {
  scene: Scene;
  player: Actor;
  enemys: Actor[];
}

interface IGameProperties extends IGameConstructor {}

export default class Game extends EventEmitter implements IGameProperties {
  scene: Scene;
  player: Actor;
  enemys: Actor[];

  constructor(properties: IGameConstructor) {
    super();
    this.scene = properties.scene;
    this.player = properties.player;
    this.enemys = properties.enemys;
  }

  @emitEvent("changed")
  updateLevel() {
    console.log("ooo");
  }
}
