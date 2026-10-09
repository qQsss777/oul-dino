import Actor from "../../core/actor/actor";
import MeshAsset from "../../core/asset/meshAsset";
import { createLine } from "../../core/utils/geometry/createLine";

const horizontalLine = createLine(1, 0);
const horizontalLocations: [number, number][] = [];
for (let i = 0.1; i < 1; i = i + 0.1) {
  horizontalLocations.push([0, i]);
}

export const gridHorizontalActor = new Actor({
  label: "grid actor",
  asset: new MeshAsset({
    locations: horizontalLocations,
    preserveRatio: false,
    label: "grid",
    geometry: {
      value: horizontalLine,
      geometryType: "line",
    },
    material: {
      color: [0.5, 0.5, 0.5, 0.5],
    },
    transform: {
      scale: [1, 1],
      translate: [0, 0],
      rotation: 0,
    },
  }),
});

const verticalLine = createLine(0, 1);
const verticalLocations: [number, number][] = [];
for (let i = 0.1; i < 1; i = i + 0.1) {
  verticalLocations.push([i, 0]);
}
export const gridVerticalActor = new Actor({
  label: "grid actor",
  asset: new MeshAsset({
    locations: verticalLocations,
    preserveRatio: false,
    label: "grid",
    geometry: {
      value: verticalLine,
      geometryType: "line",
    },
    material: {
      color: [0.5, 0.5, 0.5, 0.5],
    },
    transform: {
      scale: [1, 1],
      translate: [0, 0],
      rotation: 0,
    },
  }),
});

export const actorBoudingBoxes = (actors: Actor[]) => {
  return actors.map((actor) => {
    const a = new Actor({
      label: "debug - " + actor.label,
      asset: new MeshAsset({
        preserveRatio: false,
        label: "debug - " + actor.asset.label,
        geometry: actor.asset.geometry,
        locations: actor.asset.locations,
        material: {
          color: [1, 0, 0, 0.35],
        },
        transform: {
          scale: [1, 1],
          translate: [0, 0],
          rotation: 0,
        },
      }),
    });
    actor.on("updated", () => {
      const newLocations = [...actor.asset.locations];
      a.updateAsset("locations", newLocations);
    });

    return a;
  });
};
