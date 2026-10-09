import type Scene from "../../core/scene/scene";
import SceneView from "../../core/views/sceneView";
import type View from "./webGPUBaseView";
import ViewsFactory from "./webGPUViewsFactory";

export interface WebGPUSceneViewConstructor {
  device: GPUDevice;
  scene: Scene;
  context: GPUCanvasContext;
}
interface ISceneView extends WebGPUSceneViewConstructor {
  init(): void;
  render(): void;
  destroy(): void;
}

/**
 * SceneView is a class who group asset views and manage render lifecycle.
 * SceneView render data on canvas, can update or destroy asset views
 */
export default class WebGPUSceneView extends SceneView implements ISceneView {
  device: GPUDevice;
  context: GPUCanvasContext;
  viewFactory: ViewsFactory;
  views: View[] = [];
  #renderRequested = false;

  constructor(properties: WebGPUSceneViewConstructor) {
    super(properties);
    this.device = properties.device;
    this.context = properties.context;
    this.viewFactory = new ViewsFactory(this.device, this.context, this);
  }

  /**
   * Associate a view for each asset instance
   */
  init() {
    this.views = this.scene.actors.map((actor) =>
      this.viewFactory.createView(actor),
    );
  }

  /**
   * Draw data on the canvas
   */
  render(): void {
    this.views.forEach((v) => {
      v.update();
    });
    const renderPassDescriptor = {
      label: "renderPass",
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: this.scene.backgroundColor,
          loadOp: "clear" as GPULoadOp,
          storeOp: "store" as GPUStoreOp,
        },
      ],
    };
    const encoder = this.device.createCommandEncoder({ label: "encoder" });
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    this.views.forEach((v) => {
      v.render(pass);
    });
    pass.end();
    this.device.queue.submit([encoder.finish()]);
    if (this.scene.isUpdating()) {
      requestAnimationFrame(() => {
        this.scene.update();
      });
    }
  }

  requestRender(): void {
    if (this.#renderRequested) return;
    this.#renderRequested = true;
    requestAnimationFrame(() => {
      this.#renderRequested = false;
      this.render();
    });
  }
}
