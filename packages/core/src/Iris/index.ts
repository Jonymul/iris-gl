import { CanvasRenderer } from "../CanvasRenderer";
import { CropParameters, defaultCropParameters } from "../types/CropParameters";
import { Dimensions } from "../types/Dimensions";

export class Iris {
  private canvasRenderer: CanvasRenderer;
  private inputDimensions: Dimensions = { width: 0, height: 0 };
  private cropParams: CropParameters = defaultCropParameters;
  private maxOutputDimensions: Dimensions;

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

  setMaxOutputDimensions(dimensions: Dimensions) {
    this.maxOutputDimensions = dimensions;
  }

  render() {
    return this.canvasRenderer.render({ ...this.getOutputDimensions() });
  }
}