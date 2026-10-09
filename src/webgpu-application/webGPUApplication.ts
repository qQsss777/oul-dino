import type Actor from "../core/actor/actor";
import type Game from "../core/game/game";
import type { IInputNotification } from "../core/scene/scene";
import {
  actorBoudingBoxes,
  gridHorizontalActor,
  gridVerticalActor,
} from "./debug/debugMode";
import WebGPUSceneView from "./webgpu-views/webGPUSceneView";

interface WebGPUGameApplicationConstructor {
  game: Game;
  canvas: HTMLCanvasElement;
}

interface GameApplicationProperties extends WebGPUGameApplicationConstructor {
  render(): void;
  init(): Promise<void>;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  context: GPUCanvasContext | null;
}

export default class webGPUApplication implements GameApplicationProperties {
  game: Game;
  canvas: HTMLCanvasElement;
  adapter: GPUAdapter | null = null;
  device: GPUDevice | null = null;
  context: GPUCanvasContext | null = null;
  presentationFormat: GPUTextureFormat | null = null;
  sceneView: WebGPUSceneView | null = null;
  #previousTime: number = 0;
  #abortController = new AbortController();
  #debug = false;
  constructor(properties: WebGPUGameApplicationConstructor) {
    this.game = properties.game;
    this.canvas = properties.canvas;
    this.#debug = true;
  }

  async init(): Promise<void> {
    if (!navigator.gpu) {
      console.error("need a browser that supports WebGPU");
      return;
    }
    this.adapter = await navigator.gpu.requestAdapter();
    if (!this.adapter) {
      console.error("could not get GPU adapter");
      return;
    }
    this.device = await this.adapter.requestDevice();
    if (!this.device) {
      console.error("need a browser that supports WebGPU");
      return;
    }
    this.#attachResizeObserver();

    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.presentationFormat,
    });
    this.sceneView = new WebGPUSceneView({
      scene: this.game.scene,
      device: this.device,
      context: this.context,
    });
    this.sceneView.init();
    if (this.#debug) {
      const targets = this.sceneView.scene.actors.filter(
        (a) => a.enableCollision,
      );
      actorBoudingBoxes(targets).forEach((a) => {
        this.sceneView.scene.add(a);
      });
      this.sceneView.scene.add(gridHorizontalActor);
      this.sceneView.scene.add(gridVerticalActor);
    }
    this.#attachGameEvents();

    // raF pour une animation fluide
    requestAnimationFrame(this.#renderLoop);
  }

  render() {
    this.sceneView?.requestRender();
  }

  #attachResizeObserver() {
    const observer = new ResizeObserver((_entries) => {
      const compStyles = window.getComputedStyle(this.canvas);
      this.canvas.width = parseInt(compStyles.width, 10);
      this.canvas.height = parseInt(compStyles.height, 10);
      // re-render
      this.render();
    });
    observer.observe(this.canvas.parentElement!);
  }

  #attachGameEvents() {
    document.addEventListener(
      "keypress",
      (event) => {
        if (event.code === "Space") {
          const inputPayload: IInputNotification = {
            name: "jump",
            data: {
              distance: 0.5,
              speed: 0.01,
            },
          };
          this.game.notifyInputs([inputPayload]);
        }
      },
      {
        signal: this.#abortController.signal,
      },
    );
  }

  // boucle de rendu pour les mise à jour hors input
  #renderLoop = (time: number) => {
    const deltaTime = (time - this.#previousTime) / 1000;
    this.#previousTime = time;
    this.game.requestUpdate(deltaTime);
    requestAnimationFrame(this.#renderLoop);
  };
}
