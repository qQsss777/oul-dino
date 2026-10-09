import type ImageAsset from "../../core/asset/imageAsset";
import BaseView, {
  type IBindGroupResources,
  type IViewConstructor,
} from "./webGPUBaseView";

export default class WebGPUActorImageView extends BaseView {
  texture: GPUTexture;
  sampler: GPUSampler;
  bindGroupResources: IBindGroupResources;
  shaderModule: GPUShaderModule;
  pipeline: GPURenderPipeline;
  uvBuffer: GPUBuffer;
  offsetBuffer: GPUBuffer;
  uvs: Float32Array;
  offset: Float32Array;
  asset: ImageAsset;

  constructor(properties: IViewConstructor) {
    super(properties);
    this.asset = this.actor.getAsset() as ImageAsset;

    // mise à jour des valeurs "dynamiques"
    this.uvs = this.updateUvs();
    this.offset = this.createOffset();

    // création des ressources "statiques" propre au type d'instance
    this.uvBuffer = this.createUvsBuffer();
    this.offsetBuffer = this.createOffsetBuffer();
    this.texture = this.createTexture();
    this.sampler = this.createSampler();
    this.bindGroupResources = this.createBindGroupResources();
    this.shaderModule = this.createShaderModule();
    this.pipeline = this.createPipeline();

    // on affecte les données au ressources
    const sourceData = this.asset.source as ImageBitmap;
    this.device.queue.copyExternalImageToTexture(
      { source: sourceData },
      { texture: this.texture },
      { width: sourceData.width, height: sourceData.height },
    );
    this.device.queue.writeBuffer(this.uvBuffer, /*bufferOffset=*/ 0, this.uvs);
    this.device.queue.writeBuffer(this.offsetBuffer, 0, this.offset);
  }

  override render(pass: GPURenderPassEncoder): void {
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroupResources.bindGroup);
    pass.setVertexBuffer(0, this.geometryBuffer);
    pass.setVertexBuffer(1, this.uvBuffer);
    pass.draw(6, this.instances);
  }

  //only offset
  update(): void {
    this.offset = this.createOffset();
    this.device.queue.writeBuffer(this.offsetBuffer, 0, this.offset);
    this.locations = new Float32Array(this.asset.locations.flat());
    this.device.queue.writeBuffer(this.locationsBuffer, 0, this.locations);
  }

  // delete buffers
  destroyActor(): void {
    this.geometryBuffer.destroy();
    this.uvBuffer.destroy();
    this.offsetBuffer.destroy();
    this.locationsBuffer.destroy();
    this.texture.destroy();
  }

  protected createUvsBuffer(): GPUBuffer {
    return this.device.createBuffer({
      size: this.uvs.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }

  protected createOffsetBuffer(): GPUBuffer {
    return this.device.createBuffer({
      size: this.offset.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  protected createlocationsBuffer(): GPUBuffer {
    return this.device.createBuffer({
      size: this.locations.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
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
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {
            sampleType: "float",
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {
            type: "filtering",
          },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "read-only-storage",
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
            resource: this.offsetBuffer,
          },
          {
            binding: 1,
            resource: this.texture.createView(),
          },
          {
            binding: 2,
            resource: this.sampler,
          },
          {
            binding: 3,
            resource: this.locationsBuffer,
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
        var<uniform> offset : vec2f;

				@group(0) @binding(1)
        var imageTexture : texture_2d<f32>;

        @group(0) @binding(2)
        var imageSampler : sampler;

        @group(0) @binding(3)
        var<storage,read> locations : array<vec2f>;

       struct VertexInput {
          @location(0) vertex: vec2f,
          @location(1) uv: vec2f,
        };

      struct VertexOutput {
          @builtin(position) vertex : vec4f,
          @location(0) uv : vec2f,
        };


      @vertex
      fn vertexMain(
        input: VertexInput,
        @builtin(instance_index) instanceIndex: u32,
      ) -> VertexOutput {
          var output: VertexOutput;
            let pos = input.vertex + locations[instanceIndex];
            let normalizedPosition =
              pos * 2.0 - 1.0;
            output.vertex = vec4f(
              normalizedPosition,
              0.0,
              1.0
            );
          output.uv = input.uv + offset;
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
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;
    this.asset.geometry.value.forEach((coord, index) => {
      if (index % 2 === 0) {
        xMin = Math.min(xMin, coord);
        xMax = Math.max(xMax, coord);
      } else {
        yMin = Math.min(yMin, coord);
        yMax = Math.max(yMax, coord);
      }
    });

    // on récupère les côtes
    const shapeXLength = xMax - xMin;
    const shapeYLength = yMax - yMin;

    // 2. on récupère la taille du canvas
    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width;

    // 3. on récupère les tailles de l'image
    const imageHeight = image.height;
    const imageWidth = image.width;

    // 4. on calcule les ratio
    const ratioX = (canvasWidth * shapeXLength) / imageWidth;
    const ratioY = (canvasHeight * shapeYLength) / imageHeight;

    return this.asset.uvs.map((uv, index) => {
      if (index % 2 === 0) {
        return uv * ratioX;
      } else {
        return uv * ratioY;
      }
    });
  }

  protected createOffset(): Float32Array {
    const xOffset = this.asset.properties.offset?.x ?? 0;
    const yOffset = this.asset.properties.offset?.y ?? 0;
    return new Float32Array([xOffset, yOffset]);
  }
}
