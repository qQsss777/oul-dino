import type { IAsset } from "../../core/asset";

interface IViewProperties {
  buffer: GPUBuffer | undefined;
  render: () => void;
  readonly asset: IAsset | undefined;
  readonly device: GPUDevice | undefined;
}

export default abstract class View implements IViewProperties {
  asset: IAsset | undefined;
  device: GPUDevice | undefined;
  abstract render(): void;
  buffer: GPUBuffer | undefined;
}
