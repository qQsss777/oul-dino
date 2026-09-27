import type ImageAsset from "../core/asset/imageAsset";
import Game from "../core/game/game";
import { loadScene } from "./scene/scene";

const generateGame = async (): Promise<Game> => {
	const scene = await loadScene();
	const game = new Game({
		scene: scene,
	});

	game.on("udapte-asked", () => {
		const groundAsset = game.scene.findAssetByLabel("ground");
		if (groundAsset) {
			const ground = groundAsset as ImageAsset;
			const newImageGroundProperties = { ...ground.properties };
			newImageGroundProperties.offset.x += 0.001;
			game.scene.updateAsset<ImageAsset, "properties">(
				ground,
				"properties",
				newImageGroundProperties,
			);
		}
		const cloudAsset = game.scene.findAssetByLabel("cloud");
		if (cloudAsset) {
			// clouds
			const cloud = cloudAsset as ImageAsset;
			const newOrigins = cloud.origins.map((origin) => {
				if (origin[0] < -0.25) {
					origin[0] = 1;
					origin[1] = 0.7 + (0.93 - 0.7) * Math.random();
				} else {
					origin[0] -= 0.0001;
				}
				return origin;
			});
			game.scene.updateAsset<ImageAsset, "origins">(
				cloud,
				"origins",
				newOrigins,
			);
			game.emit("updated");
		}
	});
	return game;
};

export { generateGame };
