import Input, { type IInputConstructor } from "./input";

export interface IMoveInputPayload {
  speed: number;
  direction: "left" | "right";
}

interface IMoveConstructor extends IInputConstructor {
  loop: boolean;
}

class MoveInput extends Input<IMoveInputPayload> implements IMoveConstructor {
  loop: boolean;

  constructor(properties: IMoveConstructor) {
    super(properties);
    this.loop = properties.loop;
  }
  compute(data?: IMoveInputPayload | undefined) {
    if (data && this.actorInstance) {
      const { speed, direction } = data;
      const shiftValue = direction === "left" ? -speed : speed;
      this.locations = [shiftValue][Symbol.iterator]();
      this.state = "busy";
    }
  }

  execute() {
    if (!this.locations || !this.actorInstance) return;
    const { value, done } = this.locations.next();
    if (done) {
      this.locations = null;
      this.state = "free";
      return;
    }
    const locations = this.actorInstance.asset.locations as [number, number][];
    const newLocations = locations.map((location) => {
      let newValue = location[0] + value;
      if (location[0] + value > 1 && this.loop) {
        newValue = 0;
      } else if (location[0] + value < 0 && this.loop) {
        newValue = 1;
      }
      location[0] = newValue;
      return location;
    });
    this.actorInstance.updateAsset("locations", newLocations);
  }
}

export default MoveInput;
