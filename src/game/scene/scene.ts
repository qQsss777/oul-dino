import Scene from "../../core/scene/scene";
import cloudActor from "../cloud/cloud";
import enemyActor from "../enemies/enemies";
import groundActor from "../ground/ground";
import playerActor from "../player/player";
import sunActor from "../sun/sun";

// game is for interaction with GameApplication
const loadScene = async (): Promise<Scene> => {
  const scene = new Scene({
    actors: [groundActor, sunActor, cloudActor, enemyActor, playerActor],
    backgroundColor: [0.4, 0.87, 0.93, 1],
  });
  await scene.load();
  return scene;
};

export { loadScene };
