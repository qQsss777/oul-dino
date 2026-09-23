import type Asset from "../asset/asset";

interface SceneProperties {
  assets: Asset[];
}
export default class Scene implements SceneProperties {
  assets: Asset[];
  constructor(properties: SceneProperties) {
    this.assets = properties.assets;
  }
}
