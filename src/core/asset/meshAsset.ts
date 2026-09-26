import type { IMaterial } from "../material/material";
import Asset, { type IAssetConstructor } from "./asset";

interface MeshAssetProperties extends IAssetConstructor {
  material: IMaterial;
  preserveRatio: boolean;
}
class MeshAsset extends Asset {
  material: IMaterial;
  preserveRatio: boolean;

  constructor(properties: MeshAssetProperties) {
    super(properties);
    this.material = properties.material;
    this.preserveRatio = properties.preserveRatio;
  }
  load(): Promise<void> {
    return Promise.resolve();
  }
}
export default MeshAsset;
