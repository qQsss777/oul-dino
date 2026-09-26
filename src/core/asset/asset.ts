import type { Geometry } from "../geometry/geometry";
import type { ITransform } from "../transform/transform";

export interface IAssetConstructor {
  label: string;
  geometry: Geometry;
  transform?: ITransform;
}

interface IAssetProperties extends IAssetConstructor {
  load: () => Promise<void>;
}

abstract class Asset implements IAssetProperties {
  label: string;
  geometry: Geometry;
  transform: ITransform;

  constructor(properties: IAssetConstructor) {
    this.label = properties.label;
    this.geometry = properties.geometry;
    this.transform = properties.transform ?? {
      position: [0, 0],
      rotation: 1,
      scale: [1, 1],
    };
  }
  abstract load(): Promise<void>;
}

export default Asset;
