import type { Geometry } from "../geometry/geometry";
import type Input from "../input/input";
import type { ITransform } from "../transform/transform";

export interface IAssetConstructor {
	label: string;
	roles?: string[];
	tags?: string[];
	geometry: Geometry;
	transform?: ITransform;
	inputs?: Input<unknown>[];
}

interface IAssetProperties extends IAssetConstructor {
	load: () => Promise<void>;
}

abstract class Asset implements IAssetProperties {
	label: string;
	geometry: Geometry;
	transform: ITransform;
	roles: string[];
	tags: string[];

	constructor(properties: IAssetConstructor) {
		this.label = properties.label;
		this.geometry = properties.geometry;
		this.transform = properties.transform ?? {
			translate: [0, 0],
			rotation: 1,
			scale: [1, 1],
		};
		this.tags = properties.tags ?? [];
		this.roles = properties.roles ?? [];
	}
	inputs?: Input<unknown>[] | undefined;
	abstract load(): Promise<void>;
}

export default Asset;
