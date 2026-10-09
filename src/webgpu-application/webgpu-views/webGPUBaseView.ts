import type Asset from "../../core/asset/asset";
import ActorView, {
  type IActorViewConstructor,
} from "../../core/views/actorView";

export interface IBindGroupResources {
  bindGroupLayout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
}

export interface IViewConstructor extends IActorViewConstructor {
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
}

export default abstract class WebGPUBaseView
  extends ActorView
  implements IViewProperties
{
  pipeline: GPURenderPipeline | undefined;
  shaderModule: GPUShaderModule | undefined;
  device: GPUDevice;
  context: GPUCanvasContext;
  asset: Asset;
  locations: Float32Array;
  geometryBuffer: GPUBuffer;
  locationsBuffer: GPUBuffer;
  viewGeometry: Float32Array | undefined;
  instances: number;

  constructor(properties: IViewConstructor) {
    super(properties);
    this.device = properties.device;
    this.context = properties.context;
    this.asset = this.actor.getAsset();
    this.instances = this.asset.locations.length;
    this.locations = new Float32Array(this.asset.locations.flat());
    this.geometryBuffer = this.#createGeometryBuffer();
    this.locationsBuffer = this.#createlocationsBuffer();
    this.device.queue.writeBuffer(
      this.geometryBuffer,
      /*bufferOffset=*/ 0,
      this.asset.geometry.value,
    );
    this.device.queue.writeBuffer(this.locationsBuffer, 0, this.locations);
  }

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
