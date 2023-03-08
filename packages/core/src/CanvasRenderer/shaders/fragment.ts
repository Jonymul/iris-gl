const glsl = (x: unknown): string => x as string;

export const shaderSrcFragment = glsl`
  precision highp float;
  varying vec2 uv;
  uniform vec2 textureResolution;

  uniform vec2 translation;
  uniform float rotation;
  uniform float scale;

  uniform sampler2D textureSampler;
  uniform float brightness;
  uniform float exposure;
  uniform float contrast;
  uniform float shadows;
  uniform float highlights;
  uniform float saturation;
  uniform float warmth;
  uniform float tint;

  mat3 translate2D(vec2 t) {
    return mat3(1.0, 0.0, t.x, 0.0, 1.0, t.y, 0.0, 0.0, 1.0);
  }

  mat3 rotate2D(float r){
    float c = cos(r);
    float s = sin(r);
    return mat3(c, -s, 0, s, c, 0, 0, 0, 1);
  }

  mat3 scale2D(vec2 s) {
    mat3 m = mat3(s.x, 0, 0, 0, s.y, 0, 0, 0, 1);
    return m;
  }

  mat3 reprojectZero(float aspectRatio) {
    return translate2D(vec2(-0.5)) * scale2D(vec2(1.0, aspectRatio));
  }

  mat3 reprojectCenter(float aspectRatio) {
    return scale2D(vec2(1.0, 1.0 / aspectRatio)) * translate2D(vec2(0.5));
  }

  vec2 applyTransform(vec2 uv, vec2 translation, float rotation, float scale) {
    float aspectRatio = textureResolution.y / textureResolution.x;
    vec3 transformCoord = vec3(uv, 1.0);

    transformCoord = transformCoord * reprojectZero(aspectRatio);

    transformCoord = transformCoord * translate2D(translation);
    transformCoord = transformCoord * rotate2D(rotation * 2.0);
    transformCoord = transformCoord * scale2D(vec2(scale));

    transformCoord = transformCoord * reprojectCenter(aspectRatio);

    return vec2(transformCoord.x, transformCoord.y);
  }

  vec3 adjustBrightness(vec3 color, float brightness) {
    return color + brightness;
  }

  vec3 adjustExposure(vec3 color, float exposure) {
    return color * pow(2.0, exposure);
  }

  vec3 adjustContrast(vec3 color, float contrast) {
    return 0.5 + (contrast + 1.0) * (color.rgb - 0.5);
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
    yiq.b = clamp(yiq.b + tint * 0.5226 * 0.1, -0.5226, 0.5226);
    vec3 rgb = YIQtoRGB * yiq;

    // adjusting warmth
    vec3 processed = vec3(
      (rgb.r < 0.5 ? (2.0 * rgb.r * warmFilter.r) : (1.0 - 2.0 * (1.0 - rgb.r) * (1.0 - warmFilter.r))),
      (rgb.g < 0.5 ? (2.0 * rgb.g * warmFilter.g) : (1.0 - 2.0 * (1.0 - rgb.g) * (1.0 - warmFilter.g))),
      (rgb.b < 0.5 ? (2.0 * rgb.b * warmFilter.b) : (1.0 - 2.0 * (1.0 - rgb.b) * (1.0 - warmFilter.b)))
    );
    return mix(rgb, processed, warmth);
  }

  vec3 adjustShadowsHighlights(vec3 color, float shadows, float highlights) {
    const vec3 luminanceWeighting = vec3(0.3, 0.3, 0.3);
    mediump float luminance = dot(color, luminanceWeighting);

    mediump float shadow = clamp((pow(luminance, 1.0 / (shadows + 1.0)) + (-0.76) * pow(luminance, 2.0 / (shadows + 1.0))) - luminance, 0.0, 1.0);
    mediump float highlight = clamp((1.0 - (pow(1.0 - luminance, 1.0 / (1.0 - highlights)) + (-0.8) * pow(1.0 - luminance, 2.0 / (1.0 - highlights)))) - luminance, -1.0, 0.0);
    lowp vec3 result = vec3(0.0, 0.0, 0.0) + ((luminance + shadow + highlight) - 0.0) * ((color - vec3(0.0, 0.0, 0.0)) / (luminance - 0.0));

    return result;
  }

  void main() {
    vec2 sampleCoords = applyTransform(uv, translation, rotation, scale);
    vec4 color = texture2D(textureSampler, sampleCoords);
    
    color.rgb = adjustShadowsHighlights(color.rgb, shadows, highlights);
    color.rgb = adjustExposure(color.rgb, exposure);
    color.rgb = adjustBrightness(color.rgb, brightness);
    color.rgb = adjustContrast(color.rgb, contrast);
    color.rgb = adjustTempTint(color.rgb, warmth, tint);
    color.rgb = adjustSaturation(color.rgb, saturation);

    gl_FragColor = color;
}
`;
