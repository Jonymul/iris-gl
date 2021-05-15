export class ShaderCompiler {
  private context: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.setWebGLRenderingContext(gl);
  }

  private compileShader(shaderSource: string, type: number) {
    const gl = this.context;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Shader failed to compile: ${gl.getShaderInfoLog(shader)}`);
      // throw new Error(
      //   `Shader failed to compile: ${gl.getShaderInfoLog(shader)}`
      // );
    }

    return shader;
  }

  compileVertexShader(shaderSource: string) {
    const gl = this.context;
    return this.compileShader(shaderSource, gl.VERTEX_SHADER);
  }

  compileFragmentShader(shaderSource: string) {
    const gl = this.context;
    return this.compileShader(shaderSource, gl.FRAGMENT_SHADER);
  }

  setWebGLRenderingContext(context: WebGLRenderingContext) {
    this.context = context;
  }
}
