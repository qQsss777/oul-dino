import type Actor from "../../core/actor/actor";
import ImageAsset from "../../core/asset/imageAsset";
import ActorImageView from "./actorImageView";
import ActorMeshView from "./actorMeshView";
import type View from "./view";

interface IViewsFactoryProps {
  device: GPUDevice;
  context: GPUCanvasContext;
  createView: (actor: Actor) => View;
}
export default class ViewsFactory implements IViewsFactoryProps {
  device: GPUDevice;
  context: GPUCanvasContext;

  constructor(device: GPUDevice, context: GPUCanvasContext) {
    this.device = device;
    this.context = context;
  }

  createView(actor: Actor): View {
    if (actor.asset instanceof ImageAsset) {
      return new ActorImageView({
        actor,
        device: this.device,
        context: this.context,
      });
    } else {
      return new ActorMeshView({
        actor,
        device: this.device,
        context: this.context,
      });
    }
  }
}
