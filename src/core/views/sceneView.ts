import type Scene from "../../core/scene/scene";
import type BaseView from "../../webgpu-application/webgpu-views/webGPUBaseView";
import type Actor from "../actor/actor";
import type { IHandler } from "../utils/event/EventEmitter";
import EventEmitter from "../utils/event/EventEmitter";
import type ActorView from "./actorView";

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
export default abstract class SceneView
  extends EventEmitter
  implements ISceneView
{
  scene: Scene;
  views: BaseView[] = [];
  #handlers: IHandler[] = [];

  constructor({ scene }: SceneViewProps) {
    super();
    this.scene = scene;
    this.#handlers.push(
      this.scene.on("add", (data: Actor) => {
        this.views.push(this.createView(data) as BaseView);
      }),
    );
  }

  protected abstract createView(actor: Actor): ActorView;

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
    this.#handlers.forEach((handler) => {
      handler.remove();
    });
    this.views.forEach((v) => {
      v.destroy();
    });
  }
}
