import Actor from "../../core/actor";
import type Asset from "../../core/asset/asset";
import ImageAsset from "../../core/asset/imageAsset";
import type MaterialAsset from "../../core/asset/materialAsset";
import ActorView from "./actorView";
import ImageView from "./imageView";
import MaterialView from "./materialView";
import type View from "./view";

interface IViewsFactoryProps {
  device: GPUDevice;
  context: GPUCanvasContext;
  createView: (asset: MaterialAsset) => View;
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
      const materialAsset = asset as MaterialAsset;
      return new MaterialView({
        asset: materialAsset,
        device: this.device,
        context: this.context,
      });
    }
  }
}
