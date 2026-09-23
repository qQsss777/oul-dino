import type { IAssetConstructor } from "./asset";
import Asset from "./asset";

type TFit = "repeat" | "clamp-to-edge";
type TInterpolation = "nearest" | "linear";
interface IImageProperties {
  interpolation: {
    x: TInterpolation;
    y: TInterpolation;
  };
  fit: {
    mode: "stretch" | "transform";
    x: TFit;
    y: TFit;
  };
  offset?: {
    x: number;
    y: number;
  };
}

export interface ImageAssetConstructor extends IAssetConstructor {
  uvs: Float32Array;
  sourcePath: string;
  properties: IImageProperties;
}

interface ImageAssetProperties extends ImageAssetConstructor {
  source: ImageBitmap | undefined;
}

class ImageAsset extends Asset implements ImageAssetProperties {
  uvs: Float32Array<ArrayBufferLike>;
  source: ImageBitmap | undefined;
  properties: IImageProperties;
  sourcePath: string;

  constructor(properties: ImageAssetConstructor) {
    super(properties);
    this.uvs = properties.uvs;
    this.properties = properties.properties;
    this.sourcePath = properties.sourcePath;
  }
  async load(): Promise<void> {
    const groundTexture = await fetch(this.sourcePath); //await fetch("/assets/ground-128x128.png");
    const img = await groundTexture.blob();
    this.source = await createImageBitmap(img, {
      colorSpaceConversion: "none",
    });
  }
}

export default ImageAsset;
