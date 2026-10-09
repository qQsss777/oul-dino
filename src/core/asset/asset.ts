import type { Geometry } from "../geometry/geometry";
import type Input from "../input/input";

export interface ITransform {
  translate: [number, number];
  rotation: number; //degres
  scale: [number, number];
}

export interface IAssetConstructor {
  label: string;
  geometry: Geometry;
  locations?: [number, number][];
  transform?: ITransform;
  inputs?: Input<unknown>[];
}

export interface IBoundingBox {
  xMax: number;
  xMin: number;
  yMin: number;
  yMax: number;
}

interface IAssetProperties extends IAssetConstructor {
  load(): Promise<void>;
  clone(): Asset;
}

abstract class Asset implements IAssetProperties {
  label: string;
  geometry: Geometry;
  transform: ITransform;
  locations: [number, number][];
  boundingBoxes: IBoundingBox;

  constructor(properties: IAssetConstructor) {
    this.label = properties.label;
    this.geometry = properties.geometry;
    this.locations = properties.locations ?? [[0, 0]];
    this.boundingBoxes = this.#computeBoudingBox();
    this.transform = properties.transform ?? {
      translate: [0, 0],
      rotation: 1,
      scale: [1, 1],
    };
    this.#computeBoudingBox();
  }
  inputs?: Input<unknown>[] | undefined;

  // l'origine de la location est toujours en bas à gauche
  #computeBoudingBox(): IBoundingBox {
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    this.geometry.value.forEach((v, idx) => {
      if (idx % 2 === 0) {
        xMin = Math.min(xMin, v);
        xMax = Math.max(xMax, v);
      } else {
        yMin = Math.min(yMin, v);
        yMax = Math.max(yMax, v);
      }
    });
    this.locations.forEach((location) => {
      xMax = Math.max(location[0], xMax);
      yMax = Math.max(location[1], yMax);
    });
    xMax = xMax > 1 ? 1 : xMax;
    yMax = yMax > 1 ? 1 : yMax;
    return { xMin, xMax, yMin, yMax };
  }
  abstract load(): Promise<void>;

  abstract clone(): Asset;
}

export default Asset;
