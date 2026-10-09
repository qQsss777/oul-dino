// Tests pour les vues

import { describe, expect, it } from "vitest";
import ActorView from "../../src/core/views/actorView";
import SceneView from "../../src/core/views/sceneView";

describe("ActorView", () => {
	it("devrait exister et avoir une méthode destroy", () => {
		expect(ActorView.prototype.destroy).toBeDefined();
	});
});

describe("SceneView", () => {
	it("devrait exister et avoir une méthode render", () => {
		expect(typeof SceneView.prototype.render).toBeDefined();
	});
});
