import type Actor from "../actor/actor";
import type { IHandler } from "../utils/event/EventEmitter";

export interface IActorViewConstructor {
  actor: Actor;
  requestRender: () => void;
}
interface IActorViewProperties extends IActorViewConstructor {
  render(arg?: unknown): void;
  update(): void;
  destroy(): void;
}
abstract class ActorView implements IActorViewProperties {
  actor: Actor;
  requestRender: () => void;
  #actorHandler: IHandler;

  constructor(properties: IActorViewConstructor) {
    this.actor = properties.actor;
    this.requestRender = properties.requestRender;
    this.#actorHandler = this.actor.on("updated", () => this.requestRender());
  }
  destroy() {
    this.#actorHandler.remove();
    this.destroyActor();
  }

  abstract render(arg?: unknown): void;
  abstract update(): void;
  protected abstract destroyActor(): void;
}

export default ActorView;
