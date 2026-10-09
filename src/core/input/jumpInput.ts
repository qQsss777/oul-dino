import Input from "./input";

export interface IJumpInputPayload {
  speed: number;
  distance: number;
}

class JumpInput extends Input<IJumpInputPayload> {
  compute(data?: IJumpInputPayload | undefined) {
    if (data && this.actorInstance) {
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
    if (!this.locations || !this.actorInstance) return;
    const { value, done } = this.locations.next();
    if (done) {
      this.locations = null;
      this.state = "free";
      return;
    }
    const locations = this.actorInstance.asset.locations as [number, number][];
    const newLocations = locations.map((location) => {
      location[1] = location[1] + value;
      return location;
    });
    this.actorInstance.updateAsset("locations", newLocations);
  }
}

export default JumpInput;
