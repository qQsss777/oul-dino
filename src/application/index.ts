import type Game from "../core/game";
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
	}

	render() {
		this.sceneView?.render();
	}

	#attachResizeObserver() {
		const onResize: ResizeObserverCallback = (entries) => {
			console.log(this.canvas);
		};
		const resizeObserver = new ResizeObserver(onResize);
		resizeObserver.observe(this.canvas);
	}
}
