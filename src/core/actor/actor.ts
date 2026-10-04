import type Asset from "../asset/asset";
import type { IRenderable } from "../scene/renderable";

export interface IActorConstructor {
  asset: Asset;
  label: string;
  roles?: string[];
  tags?: string[];
}

export interface IActorProperties extends IActorConstructor {
  /**
   * load asset component
   */
  load(): Promise<void>;
  /**
   * Update asset properties
   * @param key key of asset
   * @param value new value
   */
  updateAsset(key: string, value: unknown): void;
}

/**
 * Embed asset and manage it
 */
class Actor implements IRenderable, IActorProperties {
  asset: Asset;
  label: string;
  roles: string[];
  tags: string[];
  #updating = false;

  constructor(properties: IActorConstructor) {
    this.asset = properties.asset;
    this.label = properties.label;
    this.tags = properties.tags ?? [];
    this.roles = properties.roles ?? [];
  }
  async load(): Promise<void> {
    await this.asset.load();
  }

  getAsset(): Asset {
    return this.asset;
  }

  updateAsset(key: string, value: unknown): void {
    if (key in this.asset) {
      const k = key as keyof typeof this.asset;
      this.asset[k] = value as never;
    }
  }

  isUpdating(): boolean {
    return this.#updating;
  }
}

export default Actor;
