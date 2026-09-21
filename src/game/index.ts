import type Actor from "../core/actor";
import Game from "../core/game";
import Scene from "../core/scene";
import ground from "./ground";
import sky from "./sky";

// game is for interaction with GameApplication and player inputs
const loadScene = async (): Promise<Scene> => {
  await Promise.all([ground.load(), sky.load()]);
  return new Scene({
    assets: [ground, sky],
  });
};

const generateGame = async () => {
  const scene = await loadScene();
  return new Game({
    scene: scene,
    player: {} as Actor,
    enemys: [] as Actor[],
  });
};

export { generateGame };
