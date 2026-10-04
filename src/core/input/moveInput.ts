import type MoveableActor from "../actor/moveableActor";
import Input from "./input";

export interface IMoveInputPayload {
  direction: "right" | "left";
  speed: number;
}

class MoveInput extends Input<IMoveInputPayload> {
  compute(data?: IMoveInputPayload | undefined): void {
    if (this.assetInstance && data) {
      this.assetInstance.move(data.direction, data.speed);
    }
  }

  protected registerInstance(instance: MoveableActor): void {
    throw new Error("Method not implemented.");
  }
}

export default MoveInput;
