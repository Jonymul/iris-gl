import { CanvasRenderer } from "../CanvasRenderer";
import { CropParameters, defaultCropParameters } from "../types/CropParameters";

export class Iris {
  private canvasRenderer = new CanvasRenderer();
  private cropParams: CropParameters = defaultCropParameters;

  setImage(imageData: ImageData | HTMLImageElement) {
    this.canvasRenderer.setImage(imageData);
  }

  render() {
    return this.canvasRenderer.render();
  }
}
