import type { IAsset } from "../../core/asset";
import type { Geometry } from "../../core/geometry";

const geometries: Geometry = {
  geometryType: "triangle",
  value: new Float32Array([-1, -1, -1, -0.3, 1, -0.3, -1, -1, 1, -1, 1, -0.3]),
};

export const ground: IAsset = {
  label: "ground",
  geometry: geometries,
  material: { color: [0.5, 0.5, 0, 1] },
};
