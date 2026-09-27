import type Asset from "../asset/asset";

interface ISceneConstructor {
	assets: Asset[];
}

interface SceneProperties extends ISceneConstructor {
	findAssetByLabel: (label: string) => Asset | undefined;
	findAssetByTags: (tag: string) => Asset[];
	findAssetByRole: (role: string) => Asset[];
	removeAllAssets: () => void;
}
export default class Scene implements SceneProperties {
	assets: Asset[];

	constructor(properties: ISceneConstructor) {
		this.assets = properties.assets;
	}

	findAssetByLabel(label: string): Asset | undefined {
		return this.assets.find((asset) => asset.label === label);
	}
	findAssetByTags(tag: string): Asset[] {
		return this.assets.filter((asset) => asset.tags.includes(tag));
	}
	findAssetByRole(role: string): Asset[] {
		return this.assets.filter((asset) => asset.roles.includes(role));
	}
	updateAsset<L, K extends keyof L>(asset: L, key: K, value: L[K]): void {
		asset[key] = value;
	}
	removeAllAssets(): void {
		this.assets = [];
	}
}
