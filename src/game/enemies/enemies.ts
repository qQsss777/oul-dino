import MoveableActor from "../../core/actor/moveableActor";
import ImageAsset from "../../core/asset/imageAsset";
import MoveInput from "../../core/input/moveInput";
import { createRectangle } from "../../core/utils/geometry/createRectangle";

const enemy = new ImageAsset({
  label: "enemy",
  geometry: {
    geometryType: "triangle",
    value: createRectangle(0.1, 0.1),
  },
  locations: [[0.9, 0.13]],
  uvs: new Float32Array([
    0,
    1, // (-1, -1)
    0,
    0, // (-1, -0.3)
    1,
    0, // ( 1, -0.3)

    0,
    1, // (-1, -1)
    1,
    1, // ( 1, -1)
    1,
    0, // ( 1, -0.3)
  ]),
  sourcePath: "./assets/player.png",
  properties: {
    interpolation: {
      x: "nearest",
      y: "nearest",
    },
    fit: {
      mode: "stretch",
      x: "clamp-to-edge",
      y: "clamp-to-edge",
    },
    offset: {
      //offset pour les UVs de la texture
      x: 0,
      y: 0,
    },
    flip: {
      x: true,
      y: false,
    },
  },
});

const enemies = [];
const enemyActor = new MoveableActor({
  asset: enemy,
  label: "enemy",
  enableCollision: true,
});
const moveInput = new MoveInput({
  label: "move",
  name: "move",
  loop: true,
});
enemyActor.registerInput(moveInput);
enemies.push(enemyActor);
for (let i = 0; i < 2; i++) {
  const newEnemyActor = enemyActor.clone() as MoveableActor;
  newEnemyActor.label += i;
  const updateLocations = [...newEnemyActor.asset.locations];
  updateLocations[0][0] = i === 0 ? 0.5 : 0.7;
  newEnemyActor.asset.locations = updateLocations;
  const moveInput = new MoveInput({
    label: "move",
    name: "move",
    loop: true,
  });
  newEnemyActor.registerInput(moveInput);
  enemies.push(newEnemyActor);
}

export default enemies;
