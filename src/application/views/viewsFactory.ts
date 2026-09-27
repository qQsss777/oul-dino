import Actor from "../../core/actor/actor";
import type Asset from "../../core/asset/asset";
import ImageAsset from "../../core/asset/imageAsset";
import type MeshAsset from "../../core/asset/meshAsset";
import ActorView from "./actorView";
import ImageView from "./imageView";
import MeshView from "./MeshView";
import type View from "./view";

interface IViewsFactoryProps {
	device: GPUDevice;
	context: GPUCanvasContext;
	createView: (asset: MeshAsset) => View;
}
export default class ViewsFactory implements IViewsFactoryProps {
	device: GPUDevice;
	context: GPUCanvasContext;

	constructor(device: GPUDevice, context: GPUCanvasContext) {
		this.device = device;
		this.context = context;
	}

	createView(asset: Asset): View {
		if (asset instanceof Actor) {
			return new ActorView({
				asset,
				device: this.device,
				context: this.context,
			});
		}
		if (asset instanceof ImageAsset) {
			const imageAsset = asset as ImageAsset;
			return new ImageView({
				asset: imageAsset,
				device: this.device,
				context: this.context,
			});
		} else {
			const MeshAsset = asset as MeshAsset;
			return new MeshView({
				asset: MeshAsset,
				device: this.device,
				context: this.context,
			});
		}
	}
}
