import type Game from "../core/game/game";
import SceneView from "./views/sceneView";

interface GameApplicationConstructor {
  game: Game;
  canvas: HTMLCanvasElement;
  backgroundColor: [number, number, number, number];
}

interface GameApplicationProperties extends GameApplicationConstructor {
  render: () => void;
  init: () => Promise<void>;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  context: GPUCanvasContext | null;
}

export default class GameApplication implements GameApplicationProperties {
  game: Game;
  canvas: HTMLCanvasElement;
  adapter: GPUAdapter | null = null;
  device: GPUDevice | null = null;
  context: GPUCanvasContext | null = null;
  presentationFormat: GPUTextureFormat | null = null;
  backgroundColor: [number, number, number, number];
  sceneView: SceneView | null = null;
  #previousTime: number = 0;
  constructor(properties: GameApplicationConstructor) {
    this.game = properties.game;
    this.canvas = properties.canvas;
    this.backgroundColor = properties.backgroundColor;
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
    this.sceneView = new SceneView({
      scene: this.game.scene,
      device: this.device,
      context: this.context,
      backgroundColor: this.backgroundColor,
    });
    this.sceneView.init();
    this.#attachGameEvents();

    // raF pour une animation fluide
    requestAnimationFrame(this.#renderLoop);
  }

  render() {
    this.sceneView?.render();
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
    this.game.on("changed", () => {
      this.sceneView?.update();
      this.render();
    });
  }

  #renderLoop = (time: number) => {
    const deltaTime = (time - this.#previousTime) / 1000;
    this.#previousTime = time;
    this.game.askUpdate(deltaTime);
    requestAnimationFrame(this.#renderLoop);
  };
}
