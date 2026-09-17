import type { IAsset } from "../asset";
import type { Geometry } from "../geometry";
import type { IMaterial } from "../material";

type Movement = "right" | "left" | "jump" | "squat";
interface IActorConstructor extends IAsset {
	position: [number, number];
}
interface IActor extends IActorConstructor {
	move(movement: Movement): void;
}

export default class Actor implements IActor {
	geometry: Geometry;
	material: IMaterial;
	position: [number, number];

	constructor(props: IActorConstructor) {
		this.geometry = props.geometry;
		this.material = props.material;
		this.position = props.position;
	}
	move(movement: Movement): void {
		throw new Error("Method not implemented.");
	}
}
