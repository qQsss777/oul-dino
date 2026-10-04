import type MoveableActor from "../actor/moveableActor";
import Input from "./input";

export interface IJumpInputPayload {
  speed: number;
  distance: number;
}

type JumpActor = MoveableActor & { jump(speed: number): void };

class JumpInput extends Input<IJumpInputPayload> {
  originalY: null | number = null;
  direction: "up" | "down" = "up";

  compute(data?: IJumpInputPayload | undefined) {
    if (
      data &&
      this.actorInstance &&
      "jump" in this.actorInstance &&
      typeof this.actorInstance.jump === "function"
    ) {
      const { speed, distance } = data;
      const shiftsCount = Math.round(distance / speed);
      const shiftsPositiveArray = new Array(shiftsCount / 2).fill(speed);
      const shiftsNegativeArray = new Array(shiftsCount / 2).fill(-speed);

      this.locations = [...shiftsPositiveArray, ...shiftsNegativeArray][
        Symbol.iterator
      ]();
      this.state = "busy";
    }
  }

  execute() {
    if (!this.locations || !this.validInstanceIntegrity(this.actorInstance))
      return;
    const { value, done } = this.locations.next();
    if (done) {
      this.locations = null;
      this.state = "free";
      return;
    }
    const instance = this.actorInstance as JumpActor;
    instance.jump(value);
  }

  protected registerInstance(instance: MoveableActor): void {
    if (!("jump" in instance)) {
      Object.defineProperty(instance, "jump", {
        value: (speed: number) => {
          const locations = this.actorInstance?.asset.locations as [
            number,
            number,
          ][];
          locations.forEach((location) => {
            location[1] = location[1] + speed;
          });
        },
        writable: false,
        configurable: false,
      });
    }
  }

  protected validInstanceIntegrity(
    instance: MoveableActor | undefined,
  ): boolean {
    if (!instance) return false;
    return (
      instance && "jump" in instance && typeof instance.jump === "function"
    );
  }
}

export default JumpInput;
