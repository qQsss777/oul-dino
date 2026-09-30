import Scene from "../../core/scene/scene";
import cloudActor from "../cloud/cloud";
import groundActor from "../ground/ground";
import skyActor from "../sky/sky";
import sunActor from "../sun/sun";

// game is for interaction with GameApplication
const loadScene = async (): Promise<Scene> => {
  await Promise.all([
    groundActor.load(),
    skyActor.load(),
    cloudActor.load(),
    sunActor.load(),
  ]);
  return new Scene({
    actors: [groundActor, skyActor, sunActor, cloudActor],
    backgroundColor: [0.4, 0.87, 0.93, 1],
  });
};

export { loadScene };
