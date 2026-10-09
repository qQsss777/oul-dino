// Tests pour le module Asset

import { beforeEach, describe, expect, it } from "vitest";
import Asset from "../../src/core/asset/asset";
import MeshAsset from "../../src/core/asset/MeshAsset";
import type { Geometry } from "../../src/core/geometry/geometry";
import { createRectangle } from "../../src/core/utils/geometry/createRectangle";

// Création d'un geometry de test avec value en Float32Array
const testGeometry: Geometry = {
	geometryType: "triangle",
	value: createRectangle(1, 0.2),
};

describe("Asset", () => {
	let asset: Asset;

	beforeEach(() => {
		asset = new MeshAsset({
			label: "test-asset",
			geometry: testGeometry,
			locations: [[0, 0]],
			material: { color: [0, 0, 0, 0] },
		});
	});

	it("devrait instancier un asset avec les propriétés correctes", () => {
		expect(asset.label).toBe("test-asset");
		expect(asset.geometry).toBe(testGeometry);
		expect(asset.locations).toEqual([[0, 0]]);
	});

	it("devrait calculer les bounding boxes par défaut", () => {
		expect(asset.boundingBoxes).toBeDefined();
		// Avec createRectangle(1, 0.2), les valeurs x/y seront dans [0, 1] range
		expect(asset.boundingBoxes.xMin).toBe(0);
		expect(asset.boundingBoxes.xMax).toBeGreaterThan(0);
		expect(asset.boundingBoxes.yMin).toBe(0);
		expect(asset.boundingBoxes.yMax).toBeGreaterThan(0);
	});

	it("devrait avoir une méthode load", async () => {
		await expect(asset.load()).resolves.toBeUndefined();
	});

	it("devrait avoir une méthode clone", () => {
		const cloned = asset.clone();
		expect(cloned).toBeInstanceOf(Asset);
		expect(cloned.label).toBe("test-assetcloned");
		expect(cloned.geometry).not.toBe(testGeometry);
	});
});
