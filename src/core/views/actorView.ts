import type Actor from "../actor/actor";

interface IActorViewConstructor {
  actor: Actor;
}
interface IActorViewProperties extends IActorViewConstructor {
  render(arg?: unknown): void;
  update(): void;
  destroy(): void;
}
abstract class ActorView implements IActorViewProperties {
  actor: Actor;
  constructor(properties: IActorViewConstructor) {
    this.actor = properties.actor;
  }
  abstract render(arg?: unknown): void;
  abstract update(): void;
  abstract destroy(): void;
}

export default ActorView;
