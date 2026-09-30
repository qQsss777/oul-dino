import type Input from "../input/input";
import Actor, { type IActorConstructor } from "./actor";

interface IMoveableActorConstructor extends IActorConstructor {
  inputs?: Input<unknown>[];
}

interface IActorProperties extends IMoveableActorConstructor {
  addInput(input: Input<unknown>): void;
  isUpdating(): boolean;
}

export default class MoveableActor extends Actor implements IActorProperties {
  inputs: Input<unknown>[];
  #updating: boolean = false;

  constructor(properties: IMoveableActorConstructor) {
    super(properties);
    this.inputs = properties.inputs ?? [];
  }

  addInput(input: Input<unknown>): void {
    input.assetInstance = this;
    this.inputs.push(input);
  }

  isUpdating(): boolean {
    return this.#updating;
  }
}
