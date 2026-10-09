import type Actor from "../actor/actor";
import MoveableActor from "../actor/moveableActor";
import type { InputName } from "../input/input";
import { emitEvent } from "../utils/decorator/EventDecorator";
import EventEmitter from "../utils/event/EventEmitter";

interface ISceneConstructor {
  actors: Actor[];
  backgroundColor: number[];
}

export interface IInputNotification {
  name: InputName;
  data?: unknown;
  tags?: string[];
  roles?: string[];
}

interface SceneProperties extends ISceneConstructor {
  load(): Promise<void>;
  findactorByLabel(label: string): Actor | undefined;
  findactorByTags(tag: string): Actor[];
  findactorByRole(role: string): Actor[];
  removeAllActors(): void;
  isUpdating(): boolean;
  add(actor: Actor): void;
  /**
   * Send new data to actor for their input
   * @param payload input notification
   */
  notifyInputs(payload: IInputNotification): void;
  /**
   * watch iterator of each input, call next
   * Method called by parent and before a rendering.
   */
  update(): void;
}
export default class Scene extends EventEmitter implements SceneProperties {
  actors: Actor[];
  backgroundColor: number[];

  constructor(properties: ISceneConstructor) {
    super();
    this.actors = properties.actors;
    this.backgroundColor = properties.backgroundColor;
  }

  async load(): Promise<void> {
    await Promise.all(this.actors.map((actor) => actor.load()));
  }

  findactorByLabel(label: string): Actor | undefined {
    return this.actors.find((actor) => actor.label === label);
  }

  findactorByTags(tag: string): Actor[] {
    return this.actors.filter((actor) => actor.tags.includes(tag));
  }

  findactorByRole(role: string): Actor[] {
    return this.actors.filter((actor) => actor.roles.includes(role));
  }

  removeAllActors(): void {
    this.actors = [];
  }

  isUpdating(): boolean {
    return !!this.actors.find((actor) => actor.isUpdating());
  }

  notifyInputs(payload: IInputNotification): void {
    this.actors.forEach((actor) => {
      if (actor instanceof MoveableActor) {
        const { name, data } = payload;
        actor.notifyInput({ name, data });
      }
    });
    if (this.isUpdating()) {
      this.update();
    }
  }

  update() {
    this.actors.forEach((actor) => {
      if (actor instanceof MoveableActor && actor.isUpdating()) {
        actor.executeInputs();
      }
    });
  }

  @emitEvent("add")
  add(actor: Actor): Actor {
    this.actors.push(actor);
    return actor;
  }
}
