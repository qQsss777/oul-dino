import Actor from "../../core/actor/actor";
import ImageAsset from "../../core/asset/imageAsset";
import { createRectangle } from "../../core/utils/geometry/createRectangle";

const cloud = new ImageAsset({
  label: "cloud",
  geometry: {
    geometryType: "triangle",
    value: createRectangle(0.2, 0.2),
  },
  origins: [
    [0.2, 0.75],
    [0.48, 0.8],
    [0.71, 0.72],
    [0.92, 0.76],
    [1.15, 0.82],
  ],
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
  sourcePath: "./assets/cloud.png",
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
  },
});

const cloudActor = new Actor({
  asset: cloud,
  label: "cloud",
});

export default cloudActor;
