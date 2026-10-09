import type Actor from "../actor/actor";

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

  constructor(properties: IActorViewConstructor) {
    this.actor = properties.actor;
    this.requestRender = properties.requestRender;
    this.actor.on("updated", () => this.requestRender());
  }
  abstract render(arg?: unknown): void;
  abstract update(): void;
  abstract destroy(): void;
}

export default ActorView;
