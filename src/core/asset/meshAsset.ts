import type { IMaterial } from "../material/material";
import Asset, { type IAssetConstructor } from "./asset";

export interface IMeshAssetProperties extends IAssetConstructor {
  material: IMaterial;
}
class MeshAsset extends Asset {
  material: IMaterial;

  constructor(properties: IMeshAssetProperties) {
    super(properties);
    this.material = properties.material;
  }
  load(): Promise<void> {
    return Promise.resolve();
  }
}
export default MeshAsset;
