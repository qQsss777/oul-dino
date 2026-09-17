import type { IAsset } from "../../core/asset";
import type { Geometry } from "../../core/geometry";

const geometries: Geometry = {
  geometryType: "triangle",
  value: new Float32Array([]),
};

export const sky: IAsset = {
  label: "sky",
  geometry: geometries,
  material: { color: [0, 0, 1, 1] },
};
