import Actor from "../../core/actor";
import type { IAsset } from "../../core/asset";
import ActorView from "./actorView";
import AssetView from "./assetView";
import type View from "./view";

interface IViewsFactoryProps {
	device: GPUDevice;
	createView: (asset: IAsset) => View;
}
export default class ViewsFactory implements IViewsFactoryProps {
	readonly device: GPUDevice;
	constructor(device: GPUDevice) {
		this.device = device;
	}

	createView(asset: IAsset): View {
		if (asset instanceof Actor) {
			return new ActorView({ asset, device: this.device });
		}
		return new AssetView({ asset, device: this.device });
	}
}
