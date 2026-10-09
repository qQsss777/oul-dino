import Actor from "../../core/actor/actor";
import MeshAsset from "../../core/asset/meshAsset";
import type { Geometry } from "../../core/geometry/geometry";
import { createCircle } from "../../core/utils/geometry";

const circle = createCircle(0.1, 50);
const geometries: Geometry = {
  geometryType: "triangle",
  value: new Float32Array(circle),
};

const sun = new MeshAsset({
  label: "sun",
  geometry: geometries,
  locations: [[0.01, 0.78]],
  material: { color: [0.9, 0.82, 0.04, 1] },
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
