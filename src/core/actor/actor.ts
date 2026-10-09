import type Asset from "../asset/asset";
import type { IRenderable } from "../scene/renderable";
import { emitEvent } from "../utils/decorator/EventDecorator";
import EventEmitter from "../utils/event/EventEmitter";

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
class Actor extends EventEmitter implements IRenderable, IActorProperties {
  asset: Asset;
  label: string;
  roles: string[];
  tags: string[];
  #updating = false;

  constructor(properties: IActorConstructor) {
    super();
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

  @emitEvent("updated")
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
