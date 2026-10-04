import Actor from "../../core/actor/actor";
import MeshAsset from "../../core/asset/meshAsset";
import type { Geometry } from "../../core/geometry/geometry";
import { createCircle } from "../../core/utils/geometry";

const circle = createCircle(0.12, 50);
const geometries: Geometry = {
  geometryType: "triangle",
  value: new Float32Array(circle),
};

const sun = new MeshAsset({
  label: "sun",
  geometry: geometries,
  locations: [[1, 1]],
  material: { color: [0.9, 0.82, 0.04, 1] },
  preserveRatio: true,
  transform: {
    scale: [1, 1],
    translate: [0, 0],
    rotation: 0,
  },
});

const sunActor = new Actor({
  asset: sun,
  label: "sun actor",
});

export default sunActor;
