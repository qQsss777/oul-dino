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
	material: { color: [0.9, 0.82, 0.04, 1] },
	preserveRatio: true,
	transform: {
		scale: [1, 1],
		translate: [-0.85, 0.8],
		rotation: 0,
	},
});

export default sun;
