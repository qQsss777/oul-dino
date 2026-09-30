import type Actor from "../actor/actor";

interface ISceneConstructor {
  actors: Actor[];
  backgroundColor: number[];
}

interface SceneProperties extends ISceneConstructor {
  findactorByLabel: (label: string) => Actor | undefined;
  findactorByTags: (tag: string) => Actor[];
  findactorByRole: (role: string) => Actor[];
  removeAllActors: () => void;
}
export default class Scene implements SceneProperties {
  actors: Actor[];
  backgroundColor: number[];

  constructor(properties: ISceneConstructor) {
    this.actors = properties.actors;
    this.backgroundColor = properties.backgroundColor;
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
}
