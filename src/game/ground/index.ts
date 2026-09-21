import ImageAsset from "../../core/asset/imageAsset";

const ground = new ImageAsset({
  label: "ground",
  geometry: {
    geometryType: "triangle",
    value: new Float32Array([
      -1, -1, -1, -0.3, 1, -0.3, -1, -1, 1, -1, 1, -0.3,
    ]),
  },
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
  sourcePath: "/assets/ground.png",
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
  },
});

export default ground;
