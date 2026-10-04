import type Actor from "../../core/actor/actor";
import ImageAsset from "../../core/asset/imageAsset";
import WebGPUActorImageView from "./webGPUActorImageView";
import WebGPUActorMeshView from "./webGPUActorMeshView";
import type BaseView from "./webGPUBaseView";

interface IWebGPUViewsFactoryProperties {
  device: GPUDevice;
  context: GPUCanvasContext;
  createView(actor: Actor): BaseView;
}
export default class WebGPUViewsFactory implements IWebGPUViewsFactoryProperties {
  device: GPUDevice;
  context: GPUCanvasContext;

  constructor(device: GPUDevice, context: GPUCanvasContext) {
    this.device = device;
    this.context = context;
  }

  createView(actor: Actor): BaseView {
    if (actor.asset instanceof ImageAsset) {
      return new WebGPUActorImageView({
        actor,
        device: this.device,
        context: this.context,
      });
    } else {
      return new WebGPUActorMeshView({
        actor,
        device: this.device,
        context: this.context,
      });
    }
  }
}
