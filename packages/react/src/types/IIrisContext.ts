import { Dimensions, Iris } from "@iris/core";

export type IIrisContext = {
  // _irisInstance: Iris;
  _previewIrisInstances: Record<symbol, Iris>;
  irisParameters: any; // Placeholder
  createPreviewInstance(params: {
    canvas: HTMLCanvasElement;
    maxDimensions: Dimensions;
  }): [Iris, symbol];
  destroyPreviewInstance(instance: symbol): void;
};
