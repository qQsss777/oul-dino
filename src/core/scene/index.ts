import type { IAsset } from "../asset/asset";

interface SceneProperties {
	assets: IAsset[];
}
export default class Scene implements SceneProperties {
	assets: IAsset[];
	constructor(properties: SceneProperties) {
		this.assets = properties.assets;
	}
}
