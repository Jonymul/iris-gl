const glsl = (x: unknown): string => x as string;

export const shaderSrcVertex = glsl`
  attribute vec2 position;
  varying vec2 texCoords;

  void main() {
    texCoords = (position + 1.0) / 2.0;
    texCoords.y = 1.0 - texCoords.y;
    gl_Position = vec4(position, 0, 1.0);
  }
`;
