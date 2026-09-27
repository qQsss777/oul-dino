import type MeshAsset from "../../core/asset/meshAsset";
import * as mat3 from "../../core/utils/math/matrix";
import View, { type IBindGroupResources } from "./view";

interface MeshAssetViewConstructor {
	asset: MeshAsset;
	device: GPUDevice;
	context: GPUCanvasContext;
}

export default class MeshView extends View {
	buffer: GPUBuffer;
	shaderModule: GPUShaderModule;
	context: GPUCanvasContext;
	asset: MeshAsset;
	device: GPUDevice;
	pipeline: GPURenderPipeline;
	materialData: Float32Array;
	materialBuffer: GPUBuffer;
	matrix: Float32Array;
	matrixBuffer: GPUBuffer;
	bindGroupResources: IBindGroupResources;

	constructor(properties: MeshAssetViewConstructor) {
		super();
		this.asset = properties.asset;
		this.device = properties.device;
		this.context = properties.context;
		this.materialData = this.createMaterialData();
		this.matrix = this.createMatrix();
		this.buffer = this.createBuffer();
		this.materialBuffer = this.createMaterialBuffer();
		this.matrixBuffer = this.createMatrixBuffer();
		this.bindGroupResources = this.createBindGroupResources();
		this.shaderModule = this.createShaderModule();
		this.pipeline = this.createPipeline();
		this.device.queue.writeBuffer(
			this.buffer,
			/*bufferOffset=*/ 0,
			this.asset.geometry.value,
		);
		this.device.queue.writeBuffer(this.materialBuffer, 0, this.materialData);
		this.device.queue.writeBuffer(this.matrixBuffer, 0, this.matrix);
	}

	render(pass: GPURenderPassEncoder): void {
		pass.setPipeline(this.pipeline);
		pass.setBindGroup(0, this.bindGroupResources.bindGroup);
		pass.setVertexBuffer(0, this.buffer);
		pass.draw(this.asset.geometry.value.length / 2);
	}

	// update
	update(): void {
		// material
		this.materialData = this.createMaterialData();
		this.device.queue.writeBuffer(this.materialBuffer, 0, this.materialData);

		// position
		this.matrix = this.createMatrix();
		this.device.queue.writeBuffer(this.matrixBuffer, 0, this.matrix);
	}

	destroy(): void {
		this.buffer.destroy();
	}

	/**
	 * Create material data
	 * color
	 * aspect ratio
	 * @returns material data for buffer
	 */
	protected createMaterialData(): Float32Array {
		// color:4, ratio: 1 = 20 - mais uniforms veut 32bits minimum
		const materialData = new Float32Array(8);
		materialData.set(this.asset.material.color);
		materialData.set([this.getAspectRatio()], 4);
		return materialData;
	}

	protected createMatrix(): Float32Array {
		const matrixData = new Float32Array(48);

		const { translate, rotation, scale } = this.asset.transform;

		const translationMatrix = mat3.translation(translate);
		const rotationMatrix = mat3.rotation(rotation);
		const scaleMatrix = mat3.scaling(scale);
		// echelle de l'espace, les matrices se lisent de droite à gauche
		// d'abord l'échelle, puis la rotation, puis la transformation des coordonnées / ratio, puis la translation
		const aspectMatrix = mat3.scaling([this.getAspectRatio(), 1]);
		let matrix = mat3.multiply(translationMatrix, aspectMatrix);
		matrix = mat3.multiply(matrix, rotationMatrix);
		matrix = mat3.multiply(matrix, scaleMatrix);

		matrixData.set([
			...matrix.slice(0, 3),
			0,
			...matrix.slice(3, 6),
			0,
			...matrix.slice(6, 9),
			0,
		]);

		return matrixData;
	}

	protected getAspectRatio(): number {
		const canvas = this.context.canvas;
		return canvas.height / canvas.width;
	}

	protected createBuffer(): GPUBuffer {
		return this.device.createBuffer({
			label: `${this.asset.label} vertices`,
			size: this.asset.geometry.value.byteLength,
			usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
		});
	}

	protected createMaterialBuffer(): GPUBuffer {
		return this.device.createBuffer({
			label: `${this.asset.label} material data`,
			size: this.materialData.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
	}

	protected createMatrixBuffer(): GPUBuffer {
		return this.device.createBuffer({
			label: `${this.asset.label} matrix data`,
			size: this.matrix.byteLength,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});
	}

	protected createBindGroupResources(): IBindGroupResources {
		const bindGroupLayout = this.device.createBindGroupLayout({
			entries: [
				{
					binding: 0,
					visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
					buffer: {
						type: "uniform",
					},
				},
				{
					binding: 1,
					visibility: GPUShaderStage.VERTEX,
					buffer: {
						type: "uniform",
					},
				},
			],
		});
		return {
			bindGroupLayout,
			bindGroup: this.device.createBindGroup({
				layout: bindGroupLayout,
				entries: [
					{
						binding: 0,
						resource: this.materialBuffer,
					},
					{
						binding: 1,
						resource: this.matrixBuffer,
					},
				],
			}),
		};
	}
	protected createShaderModule(): GPUShaderModule {
		return this.device.createShaderModule({
			label: `${this.asset.label} shader module`,
			code: `
      struct Material {
        color: vec4f,
        ratio: f32
      }
			
      @group(0) @binding(0)
      var<uniform> material: Material;

			@group(0) @binding(1)
      var<uniform> matrix: mat3x3f;

      @vertex
      fn vertexMain(@location(0) pos: vec2f) ->
        @builtin(position) vec4f {
        let position = (matrix * vec3f(pos, 1)).xy;
        return vec4f(position, 0, 1);
      }

      @fragment
      fn fragmentMain() -> @location(0) vec4f {
        return material.color;
      }
  `,
		});
	}
	protected createPipeline(): GPURenderPipeline {
		return this.device.createRenderPipeline({
			label: "Cell pipeline",
			layout: this.device.createPipelineLayout({
				bindGroupLayouts: [this.bindGroupResources.bindGroupLayout],
			}),
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
