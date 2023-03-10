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
import { CanvasNotAttachedError } from "../types/CanvasNotAttachedError";

export class Iris {
  private canvasRenderer: CanvasRenderer | null = null;
  // Perhaps instead of null, we could default to an offscreen or unmounted canvas
  private sourceDimensions: Dimensions = { width: 0, height: 0 };

  private computeOutputDimensions(
    transform: TransformParameters,
    subsamplingFactor: number
  ): Dimensions {
    return {
      width: Math.round(
        (this.sourceDimensions.width * transform.dx) / subsamplingFactor
      ),
      height: Math.round(
        (this.sourceDimensions.height * transform.dy) / subsamplingFactor
      ),
    };
  }

  // private get renderDimensions(): Dimensions {
  //   const outputDimensions = this.outputDimensions;

  //   if (this.maxOutputDimensions === undefined) {
  //     return outputDimensions;
  //   }

  //   const heightRatio =
  //     this.maxOutputDimensions.height / outputDimensions.height;
  //   const widthRatio = this.maxOutputDimensions.width / outputDimensions.width;
  //   const targetRatio = Math.min(1, heightRatio, widthRatio);

  //   return {
  //     width: outputDimensions.width * targetRatio,
  //     height: outputDimensions.height * targetRatio,
  //   };
  // }

  // private getOutputPixelRatio() {
  //   return this.maxOutputDimensions?.pixelRatio || 1;
  // }

  attachCanvas(targetCanvas: HTMLCanvasElement) {
    this.canvasRenderer = new CanvasRenderer(targetCanvas);
  }

  setImage(inputImage: ImageData | HTMLImageElement) {
    if (this.canvasRenderer === null) {
      throw new CanvasNotAttachedError();
    }

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

  render(params: {
    adjustments?: Partial<AdjustmentParameters>;
    transform?: TransformParameters;
    subsamplingFactor?: number;
  }) {
    const {
      adjustments = {},
      transform = defaultTransformParameters,
      subsamplingFactor = 1,
    } = params;
    const computedAdjustments: AdjustmentParameters = {
      ...defaultAdjustmentParameters,
      ...adjustments,
    };
    if (this.canvasRenderer === null) {
      throw new CanvasNotAttachedError();
    }

    const sourceDimensions = this.sourceDimensions;
    const outputDimensions = this.computeOutputDimensions(
      transform,
      subsamplingFactor
    );

    return this.canvasRenderer.render({
      sourceDimensions: sourceDimensions,
      outputDimensions: outputDimensions,
      adjustments: computedAdjustments,
      transform: transform,
    });
  }
}
