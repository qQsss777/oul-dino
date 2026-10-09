import Actor from "../../src/core/actor/actor";
import testMeshAsset from "./meshAsset";

const testActor = new Actor({
	asset: testMeshAsset,
	label: "player",
	roles: ["player"],
	tags: ["main"],
});

export default testActor;
