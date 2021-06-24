import { AdjustmentParameters } from "../types/AdjustmentParameters";
import { Dimensions } from "../types/Dimensions";
import { UniformValue } from "../types/UniformValue";
import { ShaderCompiler } from "./ShaderCompiler";
import { warnF32List, warnI32List, warnNumeric, warnUnknownName, warnUnknownType } from "./warnings";

const BASE_VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 texCoords;

  void main() {
    texCoords = (position + 1.0) / 2.0;
    texCoords.y = 1.0 - texCoords.y;
    gl_Position = vec4(position, 0, 1.0);
  }
`;

const BASE_FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 texCoords;

  uniform sampler2D textureSampler;
  uniform float brightness;
  uniform float exposure;
  uniform float contrast;
  uniform float shadows;
  uniform float highlights;
  uniform float saturation;
  uniform float warmth;
  uniform float tint;

  vec3 adjustBrightness(vec3 color, float brightness) {
    return color + brightness;
  }

  vec3 adjustExposure(vec3 color, float exposure) {
    return color * pow(2.0, exposure + 1.0);
  }

  vec3 adjustContrast(vec3 color, float contrast) {
    return 0.5 + (contrast + 1.0) * (color.rgb - 0.5);
  }

  vec3 adjustShadowsHighlights(vec3 color, float shadows, float highlights) {
    const vec3 luminanceWeighting = vec3(0.3, 0.3, 0.3);
    float luminance = dot(color, luminanceWeighting);
    float shadow = clamp((pow(luminance, 1.0/(shadows+1.0)) + (-0.76)*pow(luminance, 2.0/(shadows+1.0))) - luminance, 0.0, 1.0);
    float highlight = clamp((1.0 - (pow(1.0-luminance, 1.0/(1.0-highlights)) + (-0.8)*pow(1.0-luminance, 2.0/(1.0-highlights)))) - luminance, -1.0, 0.0);
    return vec3(0.0, 0.0, 0.0) + ((luminance + shadow + highlight)) * ((color - vec3(0.0, 0.0, 0.0))/luminance);
  }

  vec3 adjustSaturation(vec3 color, float saturation) {
    // WCAG 2.1 relative luminance base
    const vec3 luminanceWeighting = vec3(0.2126, 0.7152, 0.0722);
    vec3 grayscaleColor = vec3(dot(color, luminanceWeighting));
    return mix(grayscaleColor, color, 1.0 + saturation);
  }

  vec3 adjustTempTint(vec3 color, float warmth, float tint) {
    const vec3 warmFilter = vec3(0.93, 0.54, 0.0);
    const mat3 RGBtoYIQ = mat3(0.299, 0.587, 0.114, 0.596, -0.274, -0.322, 0.212, -0.523, 0.311);
    const mat3 YIQtoRGB = mat3(1.0, 0.956, 0.621, 1.0, -0.272, -0.647, 1.0, -1.105, 1.702);

    // adjusting tint
    vec3 yiq = RGBtoYIQ * color;
    yiq.b = clamp(yiq.b + tint*0.5226*0.1, -0.5226, 0.5226);
    vec3 rgb = YIQtoRGB * yiq;

    // adjusting warmth
    vec3 processed = vec3(
      (rgb.r < 0.5 ? (2.0 * rgb.r * warmFilter.r) : (1.0 - 2.0 * (1.0 - rgb.r) * (1.0 - warmFilter.r))),
      (rgb.g < 0.5 ? (2.0 * rgb.g * warmFilter.g) : (1.0 - 2.0 * (1.0 - rgb.g) * (1.0 - warmFilter.g))),
      (rgb.b < 0.5 ? (2.0 * rgb.b * warmFilter.b) : (1.0 - 2.0 * (1.0 - rgb.b) * (1.0 - warmFilter.b)))
    );
    return mix(rgb, processed, warmth);
  }

  void main() {
    vec4 color = texture2D(textureSampler, texCoords);
    
    color.rgb = adjustBrightness(color.rgb, brightness);
    color.rgb = adjustBrightness(color.rgb, exposure);
    color.rgb = adjustContrast(color.rgb, contrast);
    // color.rgb = adjustShadowsHighlights(color.rgb, shadows, highlights);
    color.rgb = adjustTempTint(color.rgb, warmth, tint);
    color.rgb = adjustSaturation(color.rgb, saturation);

    gl_FragColor = color;
  }
`;

const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

export type InterpolationMode = "Linear" | "Nearest";

type CanvasRendererState = "Awaiting Image" | "Ready";

export class CanvasRenderer {
  private state: CanvasRendererState = "Awaiting Image";
  private canvas: HTMLCanvasElement;
  private context: WebGLRenderingContext;
  private shaderCompiler: ShaderCompiler;
  private currentProgram: WebGLProgram;
  private programUniformLocations = new Map<string, {type: number, location: WebGLUniformLocation}>();

  constructor(targetCanvas: HTMLCanvasElement) {
    this.canvas = targetCanvas;
    this.canvas.width = 0;
    this.canvas.height = 0;

    const gl = (this.context = this.canvas.getContext("webgl"));

    if (gl === null) {
      throw new Error("Couldn't get a WebGL context");
    }

    this.shaderCompiler = new ShaderCompiler(gl);

    this.clearCanvas();
    const program = this.createProgram([
      this.shaderCompiler.compileVertexShader(BASE_VERTEX_SHADER),
      this.shaderCompiler.compileFragmentShader(BASE_FRAGMENT_SHADER),
    ]);
    this.useProgram(program);
    this.getUniforms();
  }

  private createProgram(shaders: WebGLShader[]) {
    const gl = this.context;
    const program = gl.createProgram();
    shaders.forEach((shader) => gl.attachShader(program, shader));
    gl.linkProgram(program);

    return program;
  }

  private useProgram(program: WebGLProgram) {
    const gl = this.context;
    gl.useProgram(program);
    this.currentProgram = program;
  }

  private clearCanvas() {
    const gl = this.context;
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private getUniforms() {
    const gl = this.context;

    this.programUniformLocations = new Map();
    const numUniforms = gl.getProgramParameter(this.currentProgram, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(this.currentProgram, i);
      if (info === null) {
        throw new Error(`Couldn't get uniform at index: ${i}.`);
      }
      const location = gl.getUniformLocation(this.currentProgram, info.name);
      if (location) {
        this.programUniformLocations.set(info.name, {type: info.type, location});
      }
    }
  }

  private setUniform(name: string, value: UniformValue) {
    const gl = this.context;

    if (!this.programUniformLocations.has(name)) {
      warnUnknownName(name);
      return;
    }

    const info = this.programUniformLocations.get(name);

    switch (info.type) {
      case gl.FLOAT:
        if (typeof value !== "number") {
          warnNumeric(name, value);
          break;
        }
        gl.uniform1fv(info.location, [value]);
        break;
      case gl.FLOAT_VEC2:
        if (!(value instanceof Float32Array)) {
          warnF32List(name, value);
          break;
        }
        gl.uniform2fv(info.location, value);
        break;
      case gl.FLOAT_VEC3:
        if (!(value instanceof Float32Array)) {
          warnF32List(name, value);
          break;
        }
        gl.uniform3fv(info.location, value);
        break;
      case gl.FLOAT_VEC4:
        if (!(value instanceof Float32Array)) {
          warnF32List(name, value);
          break;
        }
        gl.uniform4fv(info.location, value);
        break;
      case gl.BOOL:
      case gl.INT:
        if (typeof value !== "number") {
          warnNumeric(name, value);
          break;
        }
        gl.uniform1iv(info.location, [value]);
        break;
      case gl.BOOL_VEC2:
      case gl.INT_VEC2:
        if (!(value instanceof Int32Array)) {
          warnI32List(name, value);
          break;
        }
        gl.uniform2iv(info.location, value);
        break;
      case gl.BOOL_VEC3:
      case gl.INT_VEC3:
        if (!(value instanceof Int32Array)) {
          warnI32List(name, value);
          break;
        }
        gl.uniform3iv(info.location, value);
        break;
      case gl.BOOL_VEC4:
      case gl.INT_VEC4:
        if (!(value instanceof Int32Array)) {
          warnI32List(name, value);
          break;
        }
        gl.uniform4iv(info.location, value);
        break;
      default:
        warnUnknownType(name);
    }
  }

  private setTexture(
    image: ImageData | HTMLImageElement,
    options: { interpolationMode?: InterpolationMode } = {}
  ) {
    const gl = this.context;
    let glInterpolationMode: number;
    const { interpolationMode = "Linear" } = options;

    switch (interpolationMode) {
      case "Nearest":
        glInterpolationMode = gl.NEAREST;
        break;

      case "Linear":
      default:
        glInterpolationMode = gl.LINEAR;
        break;
    }

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glInterpolationMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glInterpolationMode);
    this.state = "Ready";
  }

  private draw(params: Dimensions & { adjustments: AdjustmentParameters, pixelRatio: number }) {
    const gl = this.context;

    if (this.state !== "Ready") {
      throw new Error(
        "Iris Failed to render. setImageData() has not been called."
      );
    }

    this.canvas.width = params.width * params.pixelRatio;
    this.canvas.height = params.height * params.pixelRatio;
    this.canvas.style.width = `${params.width}px`;
    this.canvas.style.height = `${params.height}px`;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Bind VERTICES as the active array buffer.
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

    // Set and enable our array buffer as the program's "position" variable
    const positionLocation = gl.getAttribLocation(
      this.currentProgram,
      "position"
    );
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    // Set our adjustments
    this.setUniform("brightness", params.adjustments.brightness);
    this.setUniform("exposure", params.adjustments.exposure);
    this.setUniform("contrast", params.adjustments.contrast);
    // this.setUniform("highlights", params.adjustments.highlights);
    // this.setUniform("shadows", params.adjustments.shadows);
    this.setUniform("saturation", params.adjustments.saturation);
    this.setUniform("warmth", params.adjustments.warmth);
    this.setUniform("tint", params.adjustments.tint);

    // Draw our 6 VERTICES as 2 triangles
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private getImageDataFromCanvas() {
    const gl = this.context;
    const pixelBuffer = new Uint8ClampedArray(
      gl.drawingBufferWidth * gl.drawingBufferHeight * 4
    );
    this.context.readPixels(
      0,
      0,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixelBuffer
    );

    return new ImageData(
      pixelBuffer,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight
    );
  }

  getState() {
    return this.state;
  }

  setImage(inputImage: ImageData | HTMLImageElement) {
    this.setTexture(inputImage);
  }

  render(params: Dimensions & { adjustments: AdjustmentParameters, pixelRatio: number }) {
    this.draw(params);
    return this.getImageDataFromCanvas();
  }
}
