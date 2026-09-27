import Scene from "../../core/scene/scene";
import cloud from "../cloud/cloud";
import ground from "../ground/ground";
import sky from "../sky/sky";
import sun from "../sun/sun";

// game is for interaction with GameApplication
const loadScene = async (): Promise<Scene> => {
	await Promise.all([ground.load(), sky.load(), cloud.load()]);
	return new Scene({
		assets: [ground, sun, cloud],
	});
};

export { loadScene };
