import type { IMaterial } from "../material/material";
import Asset, { type IAssetConstructor } from "./asset";

export interface IMeshAssetProperties extends IAssetConstructor {
  material: IMaterial;
  preserveRatio?: boolean;
}
class MeshAsset extends Asset {
  material: IMaterial;
  preserveRatio: boolean;

  constructor(properties: IMeshAssetProperties) {
    super(properties);
    this.material = properties.material;
    this.preserveRatio = properties.preserveRatio ?? true;
  }
  load(): Promise<void> {
    return Promise.resolve();
  }

  clone(): MeshAsset {
    return new MeshAsset({
      label: `${this.label}cloned`,
      locations: structuredClone(this.locations),
      geometry: structuredClone(this.geometry),
      preserveRatio: this.preserveRatio,
      material: structuredClone(this.material),
    });
  }
}
export default MeshAsset;
