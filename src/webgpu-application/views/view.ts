import type Actor from "../../core/actor/actor";
import type Asset from "../../core/asset/asset";

export interface IBindGroupResources {
  bindGroupLayout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
}

export interface IViewConstructor {
  actor: Actor;
  device: GPUDevice;
  context: GPUCanvasContext;
}

interface IViewProperties extends IViewConstructor {
  asset: Asset;
  instances: number;
  locations: Float32Array;
  geometryBuffer: GPUBuffer | undefined;
  locationsBuffer: GPUBuffer | undefined;
  pipeline: GPURenderPipeline | undefined;
  shaderModule: GPUShaderModule | undefined;
  render: (pass: GPURenderPassEncoder) => void;
  update(): void;
  destroy(): void;
}

export default abstract class View implements IViewProperties {
  pipeline: GPURenderPipeline | undefined;
  shaderModule: GPUShaderModule | undefined;
  actor: Actor;
  device: GPUDevice;
  context: GPUCanvasContext;
  asset: Asset;
  locations: Float32Array;
  geometryBuffer: GPUBuffer;
  locationsBuffer: GPUBuffer;
  viewGeometry: Float32Array | undefined;
  instances: number;

  constructor(properties: IViewConstructor) {
    this.device = properties.device;
    this.actor = properties.actor;
    this.context = properties.context;
    this.asset = this.actor.getAsset();
    this.instances = this.asset.locations.length;
    this.locations = new Float32Array(this.asset.locations.flat());
    this.geometryBuffer = this.#createGeometryBuffer();
    this.locationsBuffer = this.#createlocationsBuffer();
  }

  abstract render(pass: GPURenderPassEncoder): void;
  abstract update(): void;
  abstract destroy(): void;
  protected abstract createShaderModule(): GPUShaderModule;
  protected abstract createPipeline(): GPURenderPipeline;

  #createGeometryBuffer(): GPUBuffer {
    return this.device.createBuffer({
      label: `${this.asset.label} vertices`,
      size: this.asset.geometry.value.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }

  #createlocationsBuffer(): GPUBuffer {
    return this.device.createBuffer({
      size: this.locations.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
  }
}
