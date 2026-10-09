// Tests pour le module Actor
import { beforeEach, describe, expect, it } from "vitest";
import Actor from "../../src/core/actor/actor";
import testMeshAsset from "../resources/meshAsset";

describe("Actor", () => {
	let actor: Actor;

	beforeEach(() => {
		actor = new Actor({
			asset: testMeshAsset,
			label: "player",
			roles: ["player"],
			tags: ["main"],
		});
	});

	it("devrait instancier un acteur avec les propriétés correctes", () => {
		expect(actor.label).toBe("player");
		expect(actor.roles).toEqual(["player"]);
		expect(actor.tags).toEqual(["main"]);
		expect(actor.enableCollision).toBe(false);
	});

	it("devrait avoir une propriété asset", () => {
		expect(actor.asset).toBe(testMeshAsset);
	});

	it("devrait avoir une méthode clone", () => {
		const cloned = actor.clone();
		expect(cloned).toBeInstanceOf(Actor);
		expect(cloned.label).toBe("playercloned");
		expect(cloned.roles).toEqual(["player"]);
		expect(cloned.tags).toEqual(["main"]);
	});

	it("devrait initialiser #updating à false par défaut", () => {
		expect(actor.isUpdating()).toBe(false);
	});
});
