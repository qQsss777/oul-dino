import Scene from "../../core/scene";
import { ground } from "../ground";
import { sky } from "../sky";

// scene is used for rendering through is adapter SceneView
export default new Scene({
	assets: [ground, sky],
});
