import type ImageAsset from "../core/asset/imageAsset";
import Game from "../core/game/game";
import { loadScene } from "./scene/scene";

const generateGame = async (): Promise<Game> => {
  const scene = await loadScene();
  const game = new Game({
    scene: scene,
    levelManager: null,
    sessionManager: null,
  });

  game.on("update-request", () => {
    const groundActor = game.scene.findactorByLabel("ground");
    if (groundActor) {
      const newImageGroundProperties = {
        ...(groundActor.asset as ImageAsset).properties,
      };
      newImageGroundProperties.offset.x += 0.001;
      groundActor.updateAsset("properties", newImageGroundProperties);
    }
    const cloudActor = game.scene.findactorByLabel("cloud");
    if (cloudActor) {
      // clouds
      const newlocations = (cloudActor.asset as ImageAsset).locations.map(
        (origin) => {
          if (origin[0] < -0.25) {
            origin[0] = 1;
            origin[1] = 0.7 + (0.93 - 0.7) * Math.random();
          } else {
            origin[0] -= 0.0001;
          }
          return origin;
        },
      );
      cloudActor.updateAsset("locations", newlocations);
    }
    game.emit("updated");
  });
  return game;
};

export { generateGame };
