export class CanvasNotAttachedError extends Error {
  constructor() {
    super();

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CanvasNotAttachedError.prototype);
  }
}
