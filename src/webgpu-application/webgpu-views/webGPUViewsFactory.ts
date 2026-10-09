import type Actor from "../../core/actor/actor";
import ImageAsset from "../../core/asset/imageAsset";
import WebGPUActorImageView from "./webGPUActorImageView";
import WebGPUActorMeshView from "./webGPUActorMeshView";
import type BaseView from "./webGPUBaseView";
import type WebGPUSceneView from "./webGPUSceneView";

interface IWebGPUViewsFactoryProperties {
  device: GPUDevice;
  context: GPUCanvasContext;
  view: WebGPUSceneView;
  createView(actor: Actor): BaseView;
}
export default class WebGPUViewsFactory implements IWebGPUViewsFactoryProperties {
  device: GPUDevice;
  context: GPUCanvasContext;
  view: WebGPUSceneView;

  constructor(
    device: GPUDevice,
    context: GPUCanvasContext,
    view: WebGPUSceneView,
  ) {
    this.device = device;
    this.context = context;
    this.view = view;
  }

  createView(actor: Actor): BaseView {
    if (actor.asset instanceof ImageAsset) {
      return new WebGPUActorImageView({
        actor,
        device: this.device,
        context: this.context,
        requestRender: () => this.view.requestRender(),
      });
    } else {
      return new WebGPUActorMeshView({
        actor,
        device: this.device,
        context: this.context,
        requestRender: () => this.view.requestRender(),
      });
    }
  }
}
