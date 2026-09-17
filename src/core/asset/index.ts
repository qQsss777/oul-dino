import type { Geometry } from "../geometry";
import type { IMaterial } from "../material";

export interface IAsset {
	label: string;
	geometry: Geometry;
	material: IMaterial;
}
