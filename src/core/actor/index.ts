import type MaterialAsset from "../asset/materialAsset";
import type { Geometry } from "../geometry";
import type { IMaterial } from "../material";

type Movement = "right" | "left" | "jump" | "squat";
interface IActorConstructor extends MaterialAsset {
  position: [number, number];
  label: string;
}
interface IActor extends IActorConstructor {
  move(movement: Movement): void;
}

export default class Actor implements IActor {
  geometry: Geometry;
  material: IMaterial;
  position: [number, number];
  label: string;

  constructor(props: IActorConstructor) {
    this.geometry = props.geometry;
    this.material = props.material;
    this.position = props.position;
    this.label = props.label;
  }
  load(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  move(_movement: Movement): void {
    throw new Error("Method not implemented.");
  }
}
