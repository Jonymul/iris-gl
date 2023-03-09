import { CanvasRenderer } from "../CanvasRenderer";
import {
  AdjustmentParameter,
  AdjustmentParameters,
  defaultAdjustmentParameters,
} from "../types/AdjustmentParameters";
import {
  CropParameters,
  Rotation,
  TransformParameters,
  defaultTransformParameters,
} from "../types/TransformParameters";
import { Dimensions } from "../types/Dimensions";

export class Iris {
  private canvasRenderer: CanvasRenderer;
  private sourceDimensions: Dimensions = { width: 0, height: 0 };
  private adjustmentParams: AdjustmentParameters = defaultAdjustmentParameters;
  private transformParams: TransformParameters = defaultTransformParameters;
  private maxOutputDimensions: Dimensions & { pixelRatio: number };

  constructor(targetCanvas: HTMLCanvasElement) {
    this.canvasRenderer = new CanvasRenderer(targetCanvas);
  }

  private get outputDimensions(): Dimensions {
    return {
      width: this.sourceDimensions.width * this.transformParams.dx,
      height: this.sourceDimensions.height * this.transformParams.dy,
    };
  }

  private getRenderDimensions(): Dimensions {
    const outputDimensions = this.outputDimensions;

    if (this.maxOutputDimensions === undefined) {
      return outputDimensions;
    }

    const heightRatio =
      this.maxOutputDimensions.height / outputDimensions.height;
    const widthRatio = this.maxOutputDimensions.width / outputDimensions.width;
    const targetRatio = Math.min(1, heightRatio, widthRatio);

    return {
      width: outputDimensions.width * targetRatio,
      height: outputDimensions.height * targetRatio,
    };
  }

  private getOutputPixelRatio() {
    return this.maxOutputDimensions?.pixelRatio || 1;
  }

  setImage(inputImage: ImageData | HTMLImageElement) {
    if (inputImage instanceof ImageData) {
      this.sourceDimensions = {
        width: inputImage.width,
        height: inputImage.height,
      };
    }

    if (inputImage instanceof HTMLImageElement) {
      this.sourceDimensions = {
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
    this.maxOutputDimensions = { ...dimensions, pixelRatio: pixelRatio || 1 };
  }

  setTransformRotation(rotation: Rotation) {
    this.transformParams.rotation = rotation;
  }

  getTransformRotation(): Rotation {
    return this.transformParams.rotation;
  }

  setTransformAdjust(adjust: number) {
    this.transformParams.adjust = adjust;
  }

  getTransformAdjust(): number {
    return this.transformParams.adjust;
  }

  setTransformCrop(crop: CropParameters) {
    this.transformParams.cx = crop.cx;
    this.transformParams.cy = crop.cy;
    this.transformParams.dx = crop.dx;
    this.transformParams.dy = crop.dy;
  }

  getTransformCrop(): CropParameters {
    return {
      cx: this.transformParams.cx,
      cy: this.transformParams.cy,
      dx: this.transformParams.dx,
      dy: this.transformParams.dy,
    };
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
    return this.canvasRenderer.render({
      ...this.getOutputDimensions(),
      pixelRatio: this.getOutputPixelRatio(),
      adjustments: this.adjustmentParams,
      transform: this.transformParams,
    });
  }
}
