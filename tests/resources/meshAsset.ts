import MeshAsset from "../../src/core/asset/MeshAsset";
import type { Geometry } from "../../src/core/geometry/geometry";
import type { IMaterial } from "../../src/core/material/material";
import { createRectangle } from "../../src/core/utils/geometry/createRectangle";

const testGeometry: Geometry = {
	geometryType: "triangle",
	value: createRectangle(1, 0.2),
};

const testMaterial: IMaterial = {
	color: [1, 0, 0, 1], // rouge
};

const testMeshAsset = new MeshAsset({
	label: "test-mesh",
	geometry: testGeometry,
	locations: [[0, 0]],
	material: testMaterial,
});

export default testMeshAsset;
