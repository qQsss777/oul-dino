import type { InputName } from "../input/input";
import type Input from "../input/input";
import Actor, { type IActorConstructor } from "./actor";

interface INotifyInput {
  name: InputName;
  data?: unknown;
}
interface IMoveableActorConstructor extends IActorConstructor {
  inputs?: Input<unknown>[];
}

interface IActorProperties extends IMoveableActorConstructor {
  registerInput(input: Input<unknown>): void;
  notifyInput(payload: INotifyInput): void;
  executeInputs(): void;
  isUpdating(): boolean;
}

export default class MoveableActor extends Actor implements IActorProperties {
  inputs: Input<unknown>[];

  constructor(properties: IMoveableActorConstructor) {
    super(properties);
    this.inputs = properties.inputs ?? [];
  }

  registerInput(input: Input<unknown>): void {
    input.setInstance(this);
    this.inputs.push(input);
  }

  notifyInput(payload: INotifyInput): void {
    const input = this.inputs.find(
      (input) => input.name === payload.name && input.state === "free",
    );
    if (input) {
      input.compute(payload.data);
    }
  }

  executeInputs(): void {
    this.inputs.forEach((input) => {
      if (input.state === "busy") input.execute();
    });
  }

  isUpdating(): boolean {
    return !!this.inputs.find((input) => input.state === "busy");
  }

  clone(): MoveableActor {
    return new MoveableActor({
      label: `${this.label}cloned`,
      enableCollision: this.enableCollision,
      roles: [...this.roles],
      tags: [...this.tags],
      asset: this.asset.clone(),
    });
  }
}
