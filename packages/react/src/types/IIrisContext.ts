import { AdjustmentParameters, Dimensions, Iris } from "@iris/core";

export type IIrisContext = {
  _previewIrisInstances: Record<symbol, Iris>;
  createPreviewInstance(params: {
    canvas: HTMLCanvasElement;
    pixelRatio: number;
    maxDimensions: Dimensions;
  }): [Iris, symbol];
  destroyPreviewInstance(instance: symbol): void;
  adjustments: AdjustmentParameters;
  setAdjustments(adjustments: AdjustmentParameters): void;
};
