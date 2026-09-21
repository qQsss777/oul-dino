import type { IMaterial } from "../material";
import Asset, { type IAssetConstructor } from "./asset";

interface MaterialAssetProperties extends IAssetConstructor {
	material: IMaterial;
}
class MaterialAsset extends Asset {
	material: IMaterial;
	constructor(properties: MaterialAssetProperties) {
		super(properties);
		this.material = properties.material;
	}
	load(): Promise<void> {
		return Promise.resolve();
	}
}
export default MaterialAsset;
