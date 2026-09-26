import type Asset from "../../core/asset/asset";

export interface IBindGroupResources {
  bindGroupLayout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
}

interface IViewProperties {
  buffer: GPUBuffer | undefined;
  asset: Asset | undefined;
  device: GPUDevice | undefined;
  context: GPUCanvasContext | undefined;
  pipeline: GPURenderPipeline | undefined;
  shaderModule: GPUShaderModule | undefined;
  render: (pass: GPURenderPassEncoder) => void;
  update(): void;
  destroy(): void;
}

export default abstract class View implements IViewProperties {
  pipeline: GPURenderPipeline | undefined;
  shaderModule: GPUShaderModule | undefined;
  asset: Asset | undefined;
  device: GPUDevice | undefined;
  context: GPUCanvasContext | undefined;
  buffer: GPUBuffer | undefined;
  viewGeometry: Float32Array | undefined;
  abstract render(pass: GPURenderPassEncoder): void;
  abstract update(): void;
  abstract destroy(): void;
  protected abstract createBuffer(): GPUBuffer;
  protected abstract createShaderModule(): GPUShaderModule;
  protected abstract createPipeline(): GPURenderPipeline;
  protected normalizeGeometry() {
    return this.asset?.geometry.value.map((v) => v * 2 - 1);
  }
}
