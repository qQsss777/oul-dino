// Tests pour le module Input

import { beforeEach, describe, expect, it } from "vitest";
import MoveableActor from "../../src/core/actor/moveableActor";
import JumpInput from "../../src/core/input/jumpInput";
import MoveInput from "../../src/core/input/moveInput";
import testMeshAsset from "../resources/meshAsset";

let jumpInput: JumpInput;
let actor: MoveableActor;
let moveInput: MoveInput;

describe("Input System", () => {
	beforeEach(() => {
		actor = new MoveableActor({
			asset: testMeshAsset,
			label: "player",
		});
	});

	describe("JumpInput", () => {
		beforeEach(() => {
			jumpInput = new JumpInput({
				label: "jump",
				name: "jump",
			});
			actor.registerInput(jumpInput);
		});

		it("devrait calculer le mouvement lorsque des données sont fournies", () => {
			jumpInput.compute({ speed: 10, distance: 50 });
			expect(jumpInput.state).toBe("busy");
			expect(jumpInput.locations).toBeDefined();
		});

		it("devrait exécuter le mouvement et revenir à l'état libre", () => {
			jumpInput.compute({ speed: 10, distance: 50 });
			jumpInput.execute();
			expect(jumpInput.state).toBe("busy");
		});
	});

	describe("MoveInput", () => {
		beforeEach(() => {
			moveInput = new MoveInput({
				label: "move",
				name: "move",
				loop: false,
			});
			actor.registerInput(moveInput);
		});

		it("devrait calculer le mouvement vers la gauche", () => {
			moveInput.compute({ speed: 5, direction: "left" });
			expect(moveInput.state).toBe("busy");
			expect(moveInput.locations).toBeDefined();
		});

		it("devrait exécuter le mouvement", () => {
			moveInput.compute({ speed: 5, direction: "left" });
			moveInput.execute();
			expect(moveInput.state).toBe("free");
		});

		it("devrait calculer le mouvement vers la droite", () => {
			moveInput.compute({ speed: 5, direction: "right" });
			expect(moveInput.state).toBe("busy");
		});
	});

	describe("Méthodes de notification", () => {
		it("devrait notifier un input et calculer ses données", () => {
			actor.notifyInput({ name: "jump", data: { speed: 10, distance: 50 } });
			expect(jumpInput.state).toBe("busy");
		});

		it("devrait exécuter tous les inputs", () => {
			actor.notifyInput({ name: "jump", data: { speed: 10, distance: 50 } });
			actor.notifyInput({
				name: "move",
				data: { speed: 5, direction: "right" },
			});
			// Execute inputs to change their state
			jumpInput.compute({ speed: 10, distance: 50 });
			moveInput.compute({ speed: 5, direction: "right" });
			actor.executeInputs();
			expect(actor.isUpdating()).toBe(false);
		});
	});
});
