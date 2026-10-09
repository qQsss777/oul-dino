import type Scene from "../../core/scene/scene";
import type BaseView from "../../webgpu-application/webgpu-views/webGPUBaseView";

export interface SceneViewProps {
  scene: Scene;
}
interface ISceneView extends SceneViewProps {
  init(): void;
  requestRender(): void;
  render(): void;
  destroy(): void;
}

/**
 * SceneView is a class who group asset views and manage render lifecycle.
 * SceneView render data on canvas, can update or destroy asset views
 */
export default abstract class SceneView implements ISceneView {
  scene: Scene;
  views: BaseView[] = [];

  constructor({ scene }: SceneViewProps) {
    this.scene = scene;
  }

  /**
   * Associate a view for each asset instance
   */
  abstract init(): void;

  /**
   * Draw data on the canvas
   */
  abstract render(): void;

  /**
   * Draw data on the canvas
   */
  abstract requestRender(): void;

  /**
   * Destroy all views
   */
  destroy(): void {
    this.views.forEach((v) => {
      v.destroy();
    });
  }
}
