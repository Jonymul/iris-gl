import { AdjustmentParameters, Dimensions, Iris } from "@iris/core";

export type IIrisContext = {
  _instance: Iris;
  previewCanvasDimensions: Dimensions;
  createPreviewInstance(params: {
    canvas: HTMLCanvasElement;
    pixelRatio: number;
    dimensions: Dimensions;
  }): void;
  destroyPreviewInstance(): void;
  adjustments: AdjustmentParameters;
  setAdjustments(adjustments: AdjustmentParameters): void;
};
