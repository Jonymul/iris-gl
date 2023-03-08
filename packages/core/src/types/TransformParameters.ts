export enum Rotation {
  "0deg" = 0,
  "90deg" = 90,
  "180deg" = 180,
  "270deg" = 270,
}

export type CropParameters = {
  cx: number;
  cy: number;
  dx: number;
  dy: number;
};

export type TransformParameters = CropParameters & {
  rotation: Rotation;
  adjust: number;
};

export const defaultTransformParameters: TransformParameters = {
  rotation: Rotation["0deg"],
  adjust: 0,
  cx: 0.5,
  cy: 0.5,
  dx: 1,
  dy: 1,
};
