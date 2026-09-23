import type { Geometry } from "../geometry/geometry";

export interface IAssetConstructor {
  label: string;
  geometry: Geometry;
}

interface IAssetProperties extends IAssetConstructor {
  load: () => Promise<void>;
}

abstract class Asset implements IAssetProperties {
  label: string;
  geometry: Geometry;
  constructor(properties: IAssetConstructor) {
    this.label = properties.label;
    this.geometry = properties.geometry;
  }
  abstract load(): Promise<void>;
}

export default Asset;
