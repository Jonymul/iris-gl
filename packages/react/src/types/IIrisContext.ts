import { AdjustmentParameters, Dimensions, Iris } from "@iris/core";

export type IIrisContext = {
  _instance: Iris;
  createPreviewInstance(params: {
    canvas: HTMLCanvasElement;
    pixelRatio: number;
    maxDimensions: Dimensions;
  }): void;
  destroyPreviewInstance(): void;
  adjustments: AdjustmentParameters;
  setAdjustments(adjustments: AdjustmentParameters): void;
};
