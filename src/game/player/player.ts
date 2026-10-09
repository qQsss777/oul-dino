import MoveableActor from "../../core/actor/moveableActor";
import ImageAsset from "../../core/asset/imageAsset";
import JumpInput from "../../core/input/jumpInput";
import { createRectangle } from "../../core/utils/geometry/createRectangle";

const player = new ImageAsset({
  label: "player",
  geometry: {
    geometryType: "triangle",
    value: createRectangle(0.3, 0.3),
  },
  locations: [[0.01, 0.13]],
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
      x: false,
      y: false,
    },
  },
});

const playerActor = new MoveableActor({
  asset: player,
  label: "player",
});
const jumpInput = new JumpInput({
  label: "jump",
  name: "jump",
});
playerActor.registerInput(jumpInput);
export default playerActor;
