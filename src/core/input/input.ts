import type MoveableActor from "../actor/moveableActor";

export type InputName = "move" | "jump" | "run";
export type InputState = "free" | "busy";
interface IInputConstructor {
  label: string;
  name: InputName;
}

interface IInputProperties extends IInputConstructor {
  /**
   * Validate data and calculate number of movements
   * @param data
   */
  compute: (data?: any) => void;
  /**
   * Execute location update
   */
  execute(): void;
  /**
   * use for locking
   */
  state: InputState;
  /**
   * iterator, each render call next
   */
  locations: Iterator<number, any, any> | null;
}

/**
 * Class to implement for each input.
 */
abstract class Input<T> implements IInputProperties {
  label: string;
  name: InputName;
  actorInstance: MoveableActor | undefined;
  locations: Iterator<number, any, any> | null = null;
  state: InputState = "free";

  constructor(properties: IInputConstructor) {
    this.label = properties.label;
    this.name = properties.name;
  }

  setInstance(actor: MoveableActor) {
    this.actorInstance = actor;
    this.registerInstance(actor);
  }

  /**
   * Register instance
   * @param instance MoveableActor instance
   * don't know if it's pertinent to add method to instance but just for my pleasure
   */
  protected abstract registerInstance(instance: MoveableActor): void;
  abstract compute(data?: T): void;
  abstract execute(): void;
}

export default Input;
