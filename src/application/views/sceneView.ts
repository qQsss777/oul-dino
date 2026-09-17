import type Scene from "../../core/scene";
import type View from "./view";
import ViewsFactory from "./viewsFactory";

export interface SceneViewProps {
	device: GPUDevice;
	scene: Scene;
	backgroundColor: [number, number, number, number];
	context: GPUCanvasContext;
}
interface ISceneView extends SceneViewProps {
	init: () => void;
	render: () => void;
}

export default class SceneView implements ISceneView {
	device: GPUDevice;
	context: GPUCanvasContext;
	scene: Scene;
	backgroundColor: [number, number, number, number];
	readonly viewFactory: ViewsFactory;
	views: View[] = [];

	constructor({ scene, device, context, backgroundColor }: SceneViewProps) {
		this.device = device;
		this.scene = scene;
		this.backgroundColor = backgroundColor;
		this.context = context;
		this.viewFactory = new ViewsFactory(device);
	}

	init() {
		this.views = this.scene.assets.map((asset) =>
			this.viewFactory.createView(asset),
		);
	}

	render(): void {
		const renderPassDescriptor = {
			label: "our basic canvas renderPass",
			colorAttachments: [
				{
					view: this.context.getCurrentTexture().createView(),
					clearValue: this.backgroundColor,
					loadOp: "clear" as GPULoadOp,
					storeOp: "store" as GPUStoreOp,
				},
			],
		};
		const encoder = this.device!.createCommandEncoder({ label: "encoder" });
		const pass = encoder.beginRenderPass(renderPassDescriptor);
		pass.end();
		this.device!.queue.submit([encoder.finish()]);
	}
}
