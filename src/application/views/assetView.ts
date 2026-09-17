import type { IAsset } from "../../core/asset";
import View from "./view";

interface IAssetViewConstructor {
  readonly asset: IAsset;
  readonly device: GPUDevice;
}

export default class AssetView extends View {
  buffer: GPUBuffer;
  asset: IAsset;
  device: GPUDevice;

  constructor(properties: IAssetViewConstructor) {
    super();
    this.asset = properties.asset;
    this.device = properties.device;
    this.buffer = this.device.createBuffer({
      label: `${this.asset.label} vertices`,
      size: this.asset.geometry.value.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }

  render(): void {
    console.log("render");
  }
}
