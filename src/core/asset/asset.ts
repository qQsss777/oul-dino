import type { Geometry } from "../geometry/geometry";
import type Input from "../input/input";
import type { ITransform } from "../transform/transform";

export interface IAssetConstructor {
  label: string;
  geometry: Geometry;
  transform?: ITransform;
  inputs?: Input<unknown>[];
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
      translate: [0, 0],
      rotation: 1,
      scale: [1, 1],
    };
  }
  inputs?: Input<unknown>[] | undefined;
  abstract load(): Promise<void>;
}

export default Asset;
