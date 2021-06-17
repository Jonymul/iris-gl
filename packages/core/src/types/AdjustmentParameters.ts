export type AdjustmentParameters = {
  brightness: number;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  warmth: number;
  tint: number;
  saturation: number;
  sharpness: number;
  grain: number;
  vignette: number;
};

export type AdjustmentParameter = keyof AdjustmentParameters;

export const adjustmentParameterConfig: Record<
  AdjustmentParameter,
  { min: number; max: number; default: number }
> = {
  brightness: { min: -1, max: 1, default: 0 },
  exposure: { min: -1, max: 1, default: 0 },
  contrast: { min: -1, max: 1, default: 0 },
  highlights: { min: -1, max: 1, default: 0 },
  shadows: { min: -1, max: 1, default: 0 },
  warmth: { min: -1, max: 1, default: 0 },
  tint: { min: -1, max: 1, default: 0 },
  saturation: { min: -1, max: 1, default: 0 },
  sharpness: { min: -1, max: 1, default: 0 },
  grain: { min: 0, max: 1, default: 0 },
  vignette: { min: 0, max: 1, default: 0 },
};

export const defaultAdjustmentParameters = (() => {
  const returnDefaults = {};
  Object.keys(adjustmentParameterConfig).forEach((key) => {
    returnDefaults[key] = adjustmentParameterConfig[key].default;
  });
  return returnDefaults as AdjustmentParameters;
})();
