import type Asset from "../asset/asset";

export interface IRenderable {
  asset: Asset;
  getAsset(): Asset;
}
