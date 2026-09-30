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
  buffer: GPUBuffer | undefined;
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
  buffer: GPUBuffer | undefined;
  viewGeometry: Float32Array | undefined;

  constructor(properties: IViewConstructor) {
    this.device = properties.device;
    this.actor = properties.actor;
    this.context = properties.context;
    this.asset = this.actor.getAsset();
  }

  abstract render(pass: GPURenderPassEncoder): void;
  abstract update(): void;
  abstract destroy(): void;
  protected abstract createBuffer(): GPUBuffer;
  protected abstract createShaderModule(): GPUShaderModule;
  protected abstract createPipeline(): GPURenderPipeline;
  protected normalizeGeometry() {
    return this.actor?.asset.geometry.value.map((v) => v * 2 - 1);
  }
}
