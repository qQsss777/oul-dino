import MeshAsset from "../asset/meshAsset";

type Movement = "right" | "left" | "jump" | "squat";

interface IActor {
  move(movement: Movement): void;
}

export default class Actor extends MeshAsset implements IActor {
  load(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  move(_movement: Movement): void {
    throw new Error("Method not implemented.");
  }
}
