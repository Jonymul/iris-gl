import { AdjustmentParameters } from "../types/AdjustmentParameters";
import { Dimensions } from "../types/Dimensions";
import { UniformValue } from "../types/UniformValue";
import { ShaderCompiler } from "./ShaderCompiler";
import {
  warnF32List,
  warnI32List,
  warnNumeric,
  warnUnknownName,
  warnUnknownType,
} from "./warnings";
import { shaderSrcVertex } from "./shaders/vertex";
import { shaderSrcFragment } from "./shaders/fragment";
import { TransformParameters } from "../types/TransformParameters";

const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

export type InterpolationMode = "Linear" | "Nearest";

type CanvasRendererState = "Awaiting Image" | "Ready";

export class CanvasRenderer {
  private state: CanvasRendererState = "Awaiting Image";
  private canvas: HTMLCanvasElement;
  private context: WebGLRenderingContext;
  private shaderCompiler: ShaderCompiler;
  private currentProgram: WebGLProgram;
  private programUniformLocations = new Map<
    string,
    { type: number; location: WebGLUniformLocation }
  >();

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
      this.shaderCompiler.compileVertexShader(shaderSrcVertex),
      this.shaderCompiler.compileFragmentShader(shaderSrcFragment),
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
    const numUniforms = gl.getProgramParameter(
      this.currentProgram,
      gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(this.currentProgram, i);
      if (info === null) {
        throw new Error(`Couldn't get uniform at index: ${i}.`);
      }
      const location = gl.getUniformLocation(this.currentProgram, info.name);
      if (location) {
        this.programUniformLocations.set(info.name, {
          type: info.type,
          location,
        });
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

  private draw(params: {
    sourceDimensions: Dimensions;
    outputDimensions: Dimensions;
    renderDimensions: Dimensions;
      transform: TransformParameters;
      adjustments: AdjustmentParameters;
      pixelRatio: number;
  }) {
    const gl = this.context;

    if (this.state !== "Ready") {
      throw new Error(
        "Iris Failed to render. setImageData() has not been called."
      );
    }

    const sourceAspectRatio =
      params.sourceDimensions.height / params.sourceDimensions.width;

    // TODO: Remove the concept of render/output dimensions here. It should be handled by the Iris module.
    // Maybe the canvas resizing could take place in Iris core too. Then pixel ratio is also redundant.
    this.canvas.width = params.renderDimensions.width * params.pixelRatio;
    this.canvas.height = params.renderDimensions.height * params.pixelRatio;
    this.canvas.style.width = `${params.renderDimensions.width}px`;
    this.canvas.style.height = `${params.renderDimensions.height}px`;
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

    // Set our globals
    // Note: We may be able to set "sourceAspectRatio" less frequently.
    this.setUniform("sourceAspectRatio", sourceAspectRatio);

    // Set our transforms
    this.setUniform("translation", new Float32Array([0, 0]));
    this.setUniform("rotation", 0);
    this.setUniform("scale", 1);

    // Set our adjustments
    this.setUniform("brightness", params.adjustments.brightness);
    this.setUniform("exposure", params.adjustments.exposure);
    this.setUniform("contrast", params.adjustments.contrast);
    this.setUniform("highlights", params.adjustments.highlights);
    this.setUniform("shadows", params.adjustments.shadows);
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

  render(params: {
    sourceDimensions: Dimensions;
    outputDimensions: Dimensions;
    renderDimensions: Dimensions;
      transform: TransformParameters;
      adjustments: AdjustmentParameters;
      pixelRatio: number;
  }) {
    this.draw(params);
    return this.getImageDataFromCanvas();
  }
}
