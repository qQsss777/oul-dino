import type Actor from "../core/actor/actor";
import type ImageAsset from "../core/asset/imageAsset";
import Game from "../core/game/game";
import Scene from "../core/scene/scene";
import ground from "./ground";
import sky from "./sky";

// game is for interaction with GameApplication and player inputs
const loadScene = async (): Promise<Scene> => {
  await Promise.all([ground.load(), sky.load()]);
  return new Scene({
    assets: [ground, sky],
  });
};

const generateGame = async (): Promise<Game> => {
  const scene = await loadScene();
  const game = new Game({
    scene: scene,
    player: {} as Actor,
    enemys: [] as Actor[],
  });

  game.on("udapte-asked", () => {
    const newImageGroundProperties = { ...ground.properties };
    newImageGroundProperties.offset!.x += 0.001;
    game.updateAsset<ImageAsset, "properties">(
      ground,
      "properties",
      newImageGroundProperties,
    );
  });
  return game;
};

export { generateGame };
