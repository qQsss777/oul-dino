import MaterialAsset from "../../core/asset/materialAsset";
import type { Geometry } from "../../core/geometry";

const geometries: Geometry = {
	geometryType: "triangle",
	value: new Float32Array([]),
};

const sky = new MaterialAsset({
	label: "sky",
	geometry: geometries,
	material: { color: [0, 0, 1, 1] },
});

export default sky;
