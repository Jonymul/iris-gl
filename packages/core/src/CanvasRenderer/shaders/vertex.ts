const glsl = (x: unknown): string => x as string;

export const shaderSrcVertex = glsl`
  attribute vec2 position;
  varying vec2 uv;

  void main() {
    uv = (position + 1.0) / 2.0;
    uv.y = 1.0 - uv.y;
    gl_Position = vec4(position, 0, 1.0);
  }
`;
