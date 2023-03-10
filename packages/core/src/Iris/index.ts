import { CanvasRenderer } from "../CanvasRenderer";
import {
  AdjustmentParameters,
  defaultAdjustmentParameters,
} from "../types/AdjustmentParameters";
import {
  TransformParameters,
  defaultTransformParameters,
} from "../types/TransformParameters";
import { Dimensions } from "../types/Dimensions";
import { CanvasNotAttachedError } from "../types/CanvasNotAttachedError";

export class Iris {
  private canvasRenderer: CanvasRenderer | null = null;
  // Perhaps instead of null, we could default to an offscreen or unmounted canvas
  private sourceDimensions: Dimensions = { width: 0, height: 0 };

  public computeOutputDimensions(transform: TransformParameters): Dimensions {
    return {
      width: Math.round(this.sourceDimensions.width * transform.dx),
      height: Math.round(this.sourceDimensions.height * transform.dy),
    };
  }

  private computeRenderDimensions(
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
    const renderDimensions = this.computeRenderDimensions(
      transform,
      subsamplingFactor
    );

    return this.canvasRenderer.render({
      sourceDimensions: sourceDimensions,
      renderDimensions: renderDimensions,
      adjustments: computedAdjustments,
      transform: transform,
    });
  }
}
