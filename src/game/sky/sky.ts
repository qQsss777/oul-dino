import MeshAsset from "../../core/asset/MeshAsset";
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

export default sky;
