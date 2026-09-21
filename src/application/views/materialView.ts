import type MaterialAsset from "../../core/asset/materialAsset";
import View from "./view";

interface MaterialAssetViewConstructor {
	asset: MaterialAsset;
	device: GPUDevice;
	context: GPUCanvasContext;
}

export default class MaterialView extends View {
	buffer: GPUBuffer;
	shaderModule: GPUShaderModule;
	context: GPUCanvasContext;
	asset: MaterialAsset;
	device: GPUDevice;
	pipeline: GPURenderPipeline;

	constructor(properties: MaterialAssetViewConstructor) {
		super();
		this.asset = properties.asset;
		this.device = properties.device;
		this.context = properties.context;
		this.buffer = this.createBuffer();
		this.shaderModule = this.createShaderModule();
		this.pipeline = this.createPipeline();
	}

	render(pass: GPURenderPassEncoder): void {
		this.device.queue.writeBuffer(
			this.buffer,
			/*bufferOffset=*/ 0,
			this.asset.geometry.value,
		);
		pass.setPipeline(this.pipeline);
		pass.setVertexBuffer(0, this.buffer);
		pass.draw(this.asset.geometry.value.length / 2);
	}

	protected createBuffer(): GPUBuffer {
		return this.device.createBuffer({
			label: `${this.asset.label} vertices`,
			size: this.asset.geometry.value.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		});
	}
	protected createShaderModule(): GPUShaderModule {
		return this.device.createShaderModule({
			label: `${this.asset.label} shader module`,
			code: `
    @vertex
    fn vertexMain(@location(0) pos: vec2f) ->
      @builtin(position) vec4f {
      return vec4f(pos, 0, 1);
    }

    @fragment
    fn fragmentMain() -> @location(0) vec4f {
      return vec4f(${this.asset.material.color[0]}, ${this.asset.material.color[1]}, ${this.asset.material.color[2]}, ${this.asset.material.color[3]});
    }
  `,
		});
	}
	protected createPipeline(): GPURenderPipeline {
		return this.device.createRenderPipeline({
			label: "Cell pipeline",
			layout: "auto",
			vertex: {
				module: this.shaderModule,
				entryPoint: "vertexMain",
				buffers: [
					{
						arrayStride: 8,
						attributes: [
							{
								format: "float32x2",
								offset: 0,
								shaderLocation: 0,
							},
						],
					},
				],
			},
			fragment: {
				module: this.shaderModule,
				entryPoint: "fragmentMain",
				targets: [
					{
						format: this.context.getConfiguration()!.format,
					},
				],
			},
		});
	}
}
