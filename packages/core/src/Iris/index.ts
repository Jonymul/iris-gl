import { CanvasRenderer } from "../CanvasRenderer";
import {
  AdjustmentParameter,
  AdjustmentParameters,
  defaultAdjustmentParameters,
} from "../types/AdjustmentParameters";
import { CropParameters, defaultCropParameters } from "../types/CropParameters";
import { Dimensions } from "../types/Dimensions";

export class Iris {
  private canvasRenderer: CanvasRenderer;
  private inputDimensions: Dimensions = { width: 0, height: 0 };
  private adjustmentParams: AdjustmentParameters = defaultAdjustmentParameters;
  private cropParams: CropParameters = defaultCropParameters;
  private maxOutputDimensions: Dimensions & { pixelRatio: number };

  constructor(targetCanvas: HTMLCanvasElement) {
    this.canvasRenderer = new CanvasRenderer(targetCanvas);
  }

  private getOutputDimensions() {
    if (this.maxOutputDimensions === undefined) {
      return this.inputDimensions;
    }

    const heightRatio =
      this.maxOutputDimensions.height / this.inputDimensions.height;
    const widthRatio =
      this.maxOutputDimensions.width / this.inputDimensions.width;
    const targetRatio = Math.min(1, heightRatio, widthRatio);

    return {
      width: this.inputDimensions.width * targetRatio,
      height: this.inputDimensions.height * targetRatio,
    };
  }

  private getOutputPixelRatio() {
    return this.maxOutputDimensions?.pixelRatio || 1;
  }

  setImage(inputImage: ImageData | HTMLImageElement) {
    if (inputImage instanceof ImageData) {
      this.inputDimensions = {
        width: inputImage.width,
        height: inputImage.height,
      };
    }

    if (inputImage instanceof HTMLImageElement) {
      this.inputDimensions = {
        width: inputImage.naturalWidth,
        height: inputImage.naturalHeight,
      };
    }

    this.canvasRenderer.setImage(inputImage);
  }

  getState() {
    return this.canvasRenderer.getState();
  }

  setMaxOutputDimensions(dimensions: Dimensions, pixelRatio?: number) {
    this.maxOutputDimensions = {...dimensions, pixelRatio: pixelRatio || 1};
  }

  setAdjustments(adjustments: AdjustmentParameters) {
    this.adjustmentParams = adjustments;
  }

  getAdjustments(): AdjustmentParameters {
    return { ...this.adjustmentParams };
  }

  resetAdjustments() {
    this.setAdjustments(defaultAdjustmentParameters);
  }

  setAdjustmentValue<T extends AdjustmentParameter>(
    parameter: T,
    value: AdjustmentParameters[T]
  ) {
    this.adjustmentParams[parameter] = value;
  }

  getAdjustmentValue<T extends AdjustmentParameter>(
    parameter: T
  ): AdjustmentParameters[T] {
    return this.adjustmentParams[parameter];
  }

  render() {
    return this.canvasRenderer.render({ ...this.getOutputDimensions(), pixelRatio: this.getOutputPixelRatio(), adjustments: this.adjustmentParams });
  }
}
