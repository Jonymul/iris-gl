import { ShaderCompiler } from "./ShaderCompiler";

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

  void main() {
    gl_FragColor = texture2D(textureSampler, texCoords);
  }
`;

const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

export type InterpolationMode = "Linear" | "Nearest";

type CanvasRendererState = "Awaiting Image" | "Ready";

export class CanvasRenderer {
  private state: CanvasRendererState = "Awaiting Image";
  private renderDimensions = { width: 0, height: 0 };
  private canvas: HTMLCanvasElement;
  private context: WebGLRenderingContext;
  private shaderCompiler: ShaderCompiler;
  private currentProgram: WebGLProgram;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 0;
    this.canvas.height = 0;
    document.body.appendChild(this.canvas);
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

  private draw() {
    const gl = this.context;

    if (this.state !== "Ready") {
      throw new Error(
        "Iris Failed to render. setImageData() has not been called."
      );
    }

    this.canvas.width = this.renderDimensions.width;
    this.canvas.height = this.renderDimensions.height;
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

  setDimensions(width: number, height: number) {
    this.renderDimensions = {
      width,
      height,
    };
  }

  setImage(inputImage: ImageData | HTMLImageElement) {
    this.setTexture(inputImage);

    if (inputImage instanceof ImageData) {
      this.renderDimensions = {
        width: inputImage.width,
        height: inputImage.height,
      };
    }

    if (inputImage instanceof HTMLImageElement) {
      this.renderDimensions = {
        width: inputImage.naturalWidth,
        height: inputImage.naturalHeight,
      };
    }
  }

  render() {
    this.draw();
    return this.getImageDataFromCanvas();
  }
}
