export enum Rotation {
  "0deg" = 0,
  "90deg" = 90,
  "180deg" = 180,
  "270deg" = 270,
}

export type CropParameters = {
  rotation: Rotation;
  adjust: number;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
};

export const defaultCropParameters: CropParameters = {
  rotation: Rotation["0deg"],
  adjust: 0,
  cx: 0.5,
  cy: 0.5,
  dx: 1,
  dy: 1,
};
