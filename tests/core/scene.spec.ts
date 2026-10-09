// Tests pour le module Scene

import { beforeEach, describe, expect, it } from "vitest";
import Scene from "../../src/core/scene/scene";
import testActor from "../resources/meshActor";

let scene: Scene;

describe("Scene", () => {
	beforeEach(() => {
		scene = new Scene({
			actors: [testActor],
			backgroundColor: [0, 0, 0],
		});
	});

	it("devrait instancier une scène avec les acteurs corrects", () => {
		expect(scene.actors).toEqual([testActor]);
		expect(scene.backgroundColor).toEqual([0, 0, 0]);
	});

	it("devrait trouver un acteur par label", () => {
		const found = scene.findactorByLabel("player");
		expect(found).toBe(testActor);
	});

	it("devrait retourner undefined pour un label inexistant", () => {
		const found = scene.findactorByLabel("unknown");
		expect(found).toBeUndefined();
	});

	it("devrait trouver des acteurs par rôle", () => {
		const found = scene.findactorByRole("player");
		expect(found).toEqual([testActor]);
	});

	it("devrait trouver des acteurs par tag", () => {
		const found = scene.findactorByTags("main");
		expect(found).toEqual([testActor]);
	});

	it("devrait charger les acteurs", async () => {
		await expect(scene.load()).resolves.toBeUndefined();
	});

	it("devrait retourner false pour isUpdating par défaut", () => {
		expect(scene.isUpdating()).toBe(false);
	});

	it("devrait ajouter un acteur", () => {
		scene.add(testActor);
		expect(scene.actors).toContain(testActor);
	});

	it("devrait supprimer tous les acteurs", () => {
		scene.removeAllActors();
		expect(scene.actors).toHaveLength(0);
	});
});
