import type ImageAsset from "../../core/asset/imageAsset";
import View from "./view";

interface ImageAssetConstructor {
  asset: ImageAsset;
  device: GPUDevice;
  context: GPUCanvasContext;
}

interface IBindGroupResources {
  bindGroupLayout: GPUBindGroupLayout;
  bindGroup: GPUBindGroup;
}

export default class ImageView extends View {
  texture: GPUTexture;
  context: GPUCanvasContext;
  asset: ImageAsset;
  device: GPUDevice;
  sampler: GPUSampler;
  bindGroupResources: IBindGroupResources;
  shaderModule: GPUShaderModule;
  pipeline: GPURenderPipeline;
  buffer: GPUBuffer;
  uvBuffer: GPUBuffer;
  uvs: Float32Array;

  constructor(properties: ImageAssetConstructor) {
    super();
    this.asset = properties.asset;
    this.device = properties.device;
    this.context = properties.context;
    this.uvs = this.updateUvs();
    this.buffer = this.createBuffer();
    this.uvBuffer = this.createUvsBuffer();
    this.texture = this.createTexture();
    this.sampler = this.createSampler();
    this.bindGroupResources = this.createBindGroupResources();
    this.shaderModule = this.createShaderModule();
    this.pipeline = this.createPipeline();
    const sourceData = this.asset.source as ImageBitmap;
    this.device.queue.copyExternalImageToTexture(
      { source: sourceData },
      { texture: this.texture },
      { width: sourceData.width, height: sourceData.height },
    );
    this.device.queue.writeBuffer(
      this.buffer,
      /*bufferOffset=*/ 0,
      this.asset.geometry.value,
    );
    this.device.queue.writeBuffer(this.uvBuffer, /*bufferOffset=*/ 0, this.uvs);
  }

  render(pass: GPURenderPassEncoder): void {
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroupResources.bindGroup);
    pass.setVertexBuffer(0, this.buffer);
    pass.setVertexBuffer(1, this.uvBuffer);
    pass.draw(6);
  }

  protected createBuffer(): GPUBuffer {
    return this.device.createBuffer({
      label: `${this.asset.label} vertices`,
      size: this.asset.geometry.value.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }

  protected createUvsBuffer(): GPUBuffer {
    return this.device.createBuffer({
      size: this.uvs.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }

  protected createTexture(): GPUTexture {
    const sourceData = this.asset.source as ImageBitmap;
    return this.device.createTexture({
      label: this.asset.label,
      format: "rgba8unorm",
      size: [sourceData.width, sourceData.height, 1],
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  protected createSampler(): GPUSampler {
    return this.device.createSampler({
      magFilter: this.asset.properties.interpolation.x,
      minFilter: this.asset.properties.interpolation.y,
      addressModeU: this.asset.properties.fit.x,
      addressModeV: this.asset.properties.fit.y,
    });
  }

  protected createBindGroupResources(): IBindGroupResources {
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {
            sampleType: "float",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {
            type: "filtering",
          },
        },
      ],
    });
    return {
      bindGroupLayout,
      bindGroup: this.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: this.texture.createView(),
          },
          {
            binding: 1,
            resource: this.sampler,
          },
        ],
      }),
    };
  }

  protected createShaderModule(): GPUShaderModule {
    return this.device.createShaderModule({
      label: `${this.asset.label} shader module`,
      code: `
        @group(0) @binding(0)
        var imageTexture : texture_2d<f32>;
        @group(0) @binding(1)
        var imageSampler : sampler;
        struct VertexInput {
          @location(0) position: vec2f,
          @location(1) uv: vec2f,
        };
        struct VertexOutput {
          @builtin(position) position : vec4f,
          @location(0) uv : vec2f,
        };
        @vertex
        fn vertexMain(
          input: VertexInput)
          -> VertexOutput {
          var output: VertexOutput;
          output.position = vec4f(input.position, 0.0, 1.0);
          output.uv = input.uv;
          return output;
        }
        @fragment
        fn fragmentMain(
          input : VertexOutput
        ) -> @location(0) vec4f {
          return textureSample(
            imageTexture,
            imageSampler,
            input.uv
          );
        }
      `,
    });
  }

  protected createPipeline(): GPURenderPipeline {
    return this.device.createRenderPipeline({
      label: `${this.asset.label} render pipeline`,
      layout: this.device.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupResources.bindGroupLayout],
      }),

      vertex: {
        module: this.shaderModule,
        entryPoint: "vertexMain",
        buffers: [
          {
            arrayStride: 8,
            attributes: [
              {
                format: "float32x2",
                offset: 0,
                shaderLocation: 0,
              },
            ],
          },

          {
            arrayStride: 8,
            attributes: [
              {
                format: "float32x2",
                offset: 0,
                shaderLocation: 1,
              },
            ],
          },
        ],
      },

      fragment: {
        module: this.shaderModule,
        entryPoint: "fragmentMain",
        targets: [
          {
            format: this.context.getConfiguration()!.format,
            blend: {
              color: {
                // Couleur du pixel la texture
                // × son alpha
                srcFactor: "src-alpha",

                // Couleur déjà présente
                // × ce qu'il reste d'opacité
                dstFactor: "one-minus-src-alpha",
                // On additionne les deux
                operation: "add",
              },

              alpha: {
                // Alpha de la texture × 1
                srcFactor: "one",

                // Alpha existant × transparence restante
                dstFactor: "one-minus-src-alpha",
                operation: "add",
              },
            },
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  protected updateUvs(): Float32Array {
    const fitMode = this.asset.properties.fit.mode;
    if (fitMode === "stretch") return this.asset.uvs.slice();
    const canvas = this.context.canvas;
    const image = this.asset.source as ImageBitmap;

    // 1. on recupère les min et max de notre emprise
    const coords = this.asset.geometry.value;
    let xMin = 1;
    let xMax = -1;
    let yMin = 1;
    let yMax = -1;
    coords.forEach((coord, index) => {
      if (index % 2 === 0) {
        xMin = Math.min(xMin, coord);
        xMax = Math.max(xMax, coord);
      } else {
        yMin = Math.min(yMin, coord);
        yMax = Math.max(yMax, coord);
      }
    });
    const ratioShapeX = Math.abs(xMax / xMin);
    const ratioShapeY = Math.abs(yMax / yMin);

    // 2. on récupère la taille du canvas
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;

    // 3. on récupère les tailles de l'image
    const imageHeight = image.height;
    const imageWidth = image.width;

    // 4. on calcule les ratio
    const ratioX = (canvasWidth * ratioShapeX) / imageWidth;
    const ratioY = (canvasHeight * ratioShapeY) / imageHeight;

    // 5. on applique les ratio aux coordonnées uv actuelles et on retour les nouvelles valeurs
    return this.asset.uvs.map((uv, index) => {
      if (index % 2 === 0) {
        return uv * ratioX;
      } else {
        return uv * ratioY;
      }
    });
  }
}
