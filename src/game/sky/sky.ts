import Actor from "../../core/actor/actor";
import MeshAsset from "../../core/asset/meshAsset";
import type { Geometry } from "../../core/geometry/geometry";

const geometries: Geometry = {
  geometryType: "triangle",
  value: new Float32Array([]),
};

const sky = new MeshAsset({
  label: "sky",
  geometry: geometries,
  material: { color: [0, 0, 1, 1] },
  preserveRatio: true,
});

const skyActor = new Actor({
  asset: sky,
  label: "sky actor",
});

export default skyActor;
