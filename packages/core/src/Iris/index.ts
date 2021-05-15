import { CanvasRenderer } from "../CanvasRenderer";

export class Iris {
  private canvasRenderer = new CanvasRenderer();

  setImage(imageData: ImageData | HTMLImageElement) {
    this.canvasRenderer.setImage(imageData);
  }
}
