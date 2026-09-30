import type Scene from "../../core/scene/scene";
import type View from "./view";
import ViewsFactory from "./viewsFactory";

export interface SceneViewProps {
  device: GPUDevice;
  scene: Scene;
  context: GPUCanvasContext;
}
interface ISceneView extends SceneViewProps {
  init: () => void;
  render: () => void;
  update: () => void;
  destroy: () => void;
}

/**
 * SceneView is a class who group asset views and manage render lifecycle.
 * SceneView render data on canvas, can update or destroy asset views
 */
export default class SceneView implements ISceneView {
  device: GPUDevice;
  context: GPUCanvasContext;
  scene: Scene;
  viewFactory: ViewsFactory;
  views: View[] = [];

  constructor({ scene, device, context }: SceneViewProps) {
    this.device = device;
    this.scene = scene;
    this.context = context;
    this.viewFactory = new ViewsFactory(device, context);
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
  }

  /**
   * Upate view resources.
   * Call render method after
   */
  update(): void {
    this.views.forEach((v) => {
      v.update();
    });
    this.render();
  }

  /**
   * Destroy all views
   */
  destroy(): void {
    this.views.forEach((v) => {
      v.destroy();
    });
  }
}
