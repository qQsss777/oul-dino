import ImageAsset from "../../core/asset/imageAsset";
import { createRectangle } from "../../core/utils/geometry/createRectangle";

const ground = new ImageAsset({
  label: "ground",
  geometry: {
    geometryType: "triangle",
    value: createRectangle(1, 0.3),
  },
  origins: [[0, 0]],
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
  sourcePath: "./assets/ground.png",
  properties: {
    interpolation: {
      x: "nearest",
      y: "nearest",
    },
    fit: {
      mode: "transform",
      x: "repeat",
      y: "clamp-to-edge",
    },
    offset: {
      x: 0,
      y: 0,
    },
  },
});

export default ground;
